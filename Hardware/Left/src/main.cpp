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

#define TRIG_PIN 16    // Chân Trig nối với chân 8
#define ECHO_PIN 17    // Chân Echo nối với chân 7
#define BUZZER_PIN 19
#define TIME_OUT 50000 // Time_out của pulseIn là 5000 microsecond

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

// The TinyGPSPlus object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

int count = 0;
int duty = 64;
int distanceBuffer=0;
int timeDelay = 750;
int warning = 0;

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

void setup() {
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
}

void loop() {
  if (Firebase.ready() && ss.available() > 0)
  {
    if (gps.encode(ss.read())){
      FirebaseJson content;

      String documentPath = "data/entry%20" + String(count);
      content.set("fields/id/integerValue", count);
      String time;
      time += String(gps.date.year()) + "-" + String(gps.date.month()) + "-" + String(gps.date.day()) + "T";
      if (gps.time.hour() < 10) time += "0";
      time += String(gps.time.hour()) + ":";
      if (gps.time.minute() < 10) time += "0";
      time += String(gps.time.minute()) + ":";
      if (gps.time.second() < 10) time += "0";
      time += String(gps.time.second()) + "Z";

      content.set("fields/time/timestampValue", time);
      content.set("fields/lat/stringValue", String(gps.location.lat(), 6));
      content.set("fields/lon/stringValue", String(gps.location.lng(), 6));

      count++;
      if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "" /* databaseId can be (default) or empty */, documentPath.c_str(), content.raw())){
        Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
        delay(10000);
      }
      else {
        Serial.printf("payloadLength, %d\n", fbdo.payloadLength());
        Serial.printf("maxPayloadLength, %d\n", fbdo.maxPayloadLength());
        Serial.println(fbdo.errorReason());
      }
    }
  }
  long distance = getDistance();
 
  if (distance <= 0)
  {
    Serial.println("Echo time out !!"); // nếu thời gian phản hồi vượt quá Time_out của hàm pulseIn
    digitalWrite(BUZZER_PIN, LOW);
    timeDelay = 750;
    delay(timeDelay);
  }
  else if (distance > 0 && distance <=125){
    //phat hien vat can trong khoang cach => phat am thanh buzzer bang cach kich chan output cua esp32 noi voi buzzer
    // if (distance<distanceBuffer)
    //   if (timeDelay>0)
    //     timeDelay-=100;  
    if (distance>=100) warning = 1;
    else if (distance>=75) warning = 2;
          else if (distance >=50) warning = 3;
              else if (distance >=25) warning = 4;
                  else warning = 5;
    switch (warning)
    {
    case 1:
      timeDelay=1200;
      break;
    case 2:
      timeDelay=900;
      break;
    case 3:
      timeDelay=600;
      break;
    case 4:
      timeDelay=300;
      break;
    case 5:
      timeDelay=150;
      break;
    default:
      break;
    }
    digitalWrite(BUZZER_PIN, HIGH);
    // Hiển thị khoảng cách đo được lên Serial Monitor   
    Serial.print("Nguy hiem! Vat can cach (cm): ");
    Serial.println(distance);
    delay(timeDelay);
    digitalWrite(BUZZER_PIN, LOW);
  } else
  {
    // Hiển thị khoảng cách đo được lên Serial Monitor   
    Serial.print("Khoang cach toi vat can gan nhat (cm): ");

    Serial.println(distance);
    digitalWrite(BUZZER_PIN, LOW);
    timeDelay = 750;
    delay(timeDelay);
  }
  // Chờ 1s và lặp lại cu kỳ trên
  //delay(1000);
  distanceBuffer = distance;
}