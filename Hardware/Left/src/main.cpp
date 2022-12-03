#include <Arduino.h>
#include <WiFi.h>
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>

static const int RXPin = 27, TXPin = 26;
static const uint32_t GPSBaud = 9600;

#define WIFI_SSID "AndroidAP"
#define WIFI_PASSWORD "16102002"

#define API_KEY "AIzaSyDkRstzRmdQz6g-ij4V6lG8lw_fddBiAis"

#define FIREBASE_PROJECT_ID "logicdesign-project"

#define USER_EMAIL "samplefammember@gmail.com"
#define USER_PASSWORD "sampleuser"

#define TRIG_PIN 16 // Chân Trig nối với chân 8
#define ECHO_PIN 17 // Chân Echo nối với chân 7
#define BUZZER_PIN 19
#define TIME_OUT 50000 // Time_out của pulseIn là 5000 microsecond
#define TIMER_CYCLE 10

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

// The TinyGPSPlus object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

volatile int interrruptCounter;
int totalInterruptCounter;

hw_timer_t *timer = NULL;
portMUX_TYPE timerMux = portMUX_INITIALIZER_UNLOCKED;

int count = 0;
int duty = 64;
int distanceBuffer = 0;
int timeDelay = 750;

int timer1_counter = 0;
int timer1_flag = 0;
int timer2_counter = 0;
int timer2_flag = 0;

void setTimer1(int duration)
{
  timer1_counter = duration / TIMER_CYCLE;
  timer1_flag = 0;
}

void setTimer2(int duration)
{
  timer2_counter = duration / TIMER_CYCLE;
  timer2_flag = 0;
}

void timerRun()
{
  if (timer1_counter > 0)
  {
    timer1_counter--;
    if (timer1_counter <= 0)
      timer1_flag = 1;
  }
  if (timer2_counter > 0)
  {
    timer2_counter--;
    if (timer2_counter <= 0)
      timer2_flag = 1;
  }
}

void IRAM_ATTR onTimer()
{
  portENTER_CRITICAL_ISR(&timerMux);
  timerRun();
  portEXIT_CRITICAL_ISR(&timerMux);
}

float getDistance()
{
  long duration, distanceCm;
  // Phát 1 xung 10uS từ chân Trig
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  // Thời gian tín hiệu phản hồi lại chân Echo
  duration = pulseIn(ECHO_PIN, HIGH, TIME_OUT);

  // Tính khoảng cách
  distanceCm = duration / 29.1 / 2;
  // trả lại giá trịnh tính được
  return distanceCm;
}

void setup()
{
  Serial.begin(115200);
  ss.begin(GPSBaud);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT); // Set buzzer - pin 9 as an output

#if defined(ESP8266)
  // In ESP8266 required for BearSSL rx/tx buffer for large data handle, increase Rx size as needed.
  fbdo.setBSSLBufferSize(2048 /* Rx buffer size in bytes from 512 - 16384 */, 2048 /* Tx buffer size in bytes from 512 - 16384 */);
#endif

  // Limit the size of response payload to be collected in FirebaseData
  fbdo.setResponseSize(2048);

  Firebase.begin(&config, &auth);

  Firebase.reconnectWiFi(true);

  // For sending payload callback
  // config.cfs.upload_callback = fcsUploadCallback;

  // Khởi tạo timer với chu kỳ 1us vì thạch anh của ESP32 chạy 8MHz
  timer = timerBegin(0, 80, true);
  // Khởi tạo hàm xử lý ngắt cho Timer
  timerAttachInterrupt(timer, &onTimer, true);
  // Khởi tạo hàm ngắt cho Timer là 10ms (10000 us)
  timerAlarmWrite(timer, 10000, true);
  // Bắt đầu chạy Timer
  setTimer1(10);
  setTimer2(10);
  timerAlarmEnable(timer);
}

void loop()
{
  if (Firebase.ready() && ss.available() > 0)
  {
    if (gps.encode(ss.read()))
    {
      FirebaseJson content;

      String documentPath = "data/entry%20" + String(count);
      content.set("fields/id/integerValue", count);
      String time;
      time += String(gps.date.year()) + "-" + String(gps.date.month()) + "-" + String(gps.date.day()) + "T";
      if (gps.time.hour() < 10)
        time += "0";
      time += String(gps.time.hour()) + ":";
      if (gps.time.minute() < 10)
        time += "0";
      time += String(gps.time.minute()) + ":";
      if (gps.time.second() < 10)
        time += "0";
      time += String(gps.time.second()) + "Z";

      content.set("fields/time/timestampValue", time);
      content.set("fields/lat/stringValue", String(gps.location.lat(), 6));
      content.set("fields/lon/stringValue", String(gps.location.lng(), 6));

      count++;
      if (timer1_flag)
      {
        if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "" /* databaseId can be (default) or empty */, documentPath.c_str(), content.raw()))
        {
          Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
          // delay(10000);
          setTimer1(10000);
        }
        else
          setTimer1(10);
      }
      else
      {
        Serial.printf("payloadLength, %d\n", fbdo.payloadLength());
        Serial.printf("maxPayloadLength, %d\n", fbdo.maxPayloadLength());
        Serial.println(fbdo.errorReason());
      }
    }
  }

  // gọi chương trình con getDistance
  long distance = getDistance();

  if (distance > 0 && distance <= 125)
  {
    if (distance >= 100)
      timeDelay = 1200;
    else if (distance >= 75)
      timeDelay = 900;
    else if (distance >= 50)
      timeDelay = 600;
    else if (distance >= 25)
      timeDelay = 300;
    else
      timeDelay = 150;
    digitalWrite(BUZZER_PIN, HIGH);
    // Hiển thị khoảng cách đo được lên Serial Monitor
    Serial.print("Nguy hiem! Vat can cach (cm): ");
    Serial.println(distance);
    // delay(timeDelay);
    if (timer2_flag)
    {
      digitalWrite(BUZZER_PIN, LOW);
      setTimer2(timeDelay);
    }
  }
  else
  {
    if (distance <= 0)
      Serial.println("Echo time out !!"); // nếu thời gian phản hồi vượt quá Time_out của hàm pulseIn
    else
    {
      // Hiển thị khoảng cách đo được lên Serial Monitor
      Serial.print("Khoang cach toi vat can gan nhat (cm): ");
      Serial.println(distance);
    }
    digitalWrite(BUZZER_PIN, LOW);
    timeDelay = 750;
    delay(timeDelay);
  }
  // Chờ 1s và lặp lại chu kỳ trên
  // delay(1000);
  distanceBuffer = distance;
}