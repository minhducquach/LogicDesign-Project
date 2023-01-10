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

#define TRIG_PIN 17 // Chân Trig nối với chân 17
#define ECHO_PIN 16 // Chân Echo nối với chân 16
#define BUZZER_PIN 19
#define TIME_OUT 50000 // Time_out của pulseIn là 50000 microsecond
#define TIMER_CYCLE 10

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

// The TinyGPSPlus object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);


unsigned long previousMillisBuzzer = 0;
unsigned long previousMillisGPS = 0;

int beepState = LOW;
int timeDelay = 750;
int wait = 0;           // wifi timeout

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
  if (distanceCm <= 50 && distanceCm >= 0) return distanceCm;
  else return -1;
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
    wait++;
    if (wait == 10) break;
    delay(300);
  }
  if (wait != 10 && WiFi.status() == WL_CONNECTED){
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

    #if defined(ESP8266)
    // In ESP8266 required for BearSSL rx/tx buffer for large data handle, increase Rx size as needed.
    fbdo.setBSSLBufferSize(2048 /* Rx buffer size in bytes from 512 - 16384 */, 2048 /* Tx buffer size in bytes from 512 - 16384 */);
    #endif

    // Limit the size of response payload to be collected in FirebaseData
    fbdo.setResponseSize(2048);

    Firebase.begin(&config, &auth);

    Firebase.reconnectWiFi(true);
  }

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
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

      unsigned long currentMillisGPS = millis();

      if (currentMillisGPS - previousMillisGPS >= 10000 || previousMillisGPS == 0)
      {
        previousMillisGPS = currentMillisGPS;
        count++;
        if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "" /* databaseId can be (default) or empty */, documentPath.c_str(), content.raw()))
        {
          Serial.printf("ok\n%s\n\n", fbdo.payload().c_str());
        }
        else
        {
          Serial.printf("payloadLength, %d\n", fbdo.payloadLength());
          Serial.printf("maxPayloadLength, %d\n", fbdo.maxPayloadLength());
          Serial.println(fbdo.errorReason());
        }
      }
    }
  }

  long distance = getDistance();

  if (distance > 0 && distance <= 50)
  {
    if (distance >= 50)
      timeDelay = 800;
    else if (distance >= 40)
      timeDelay = 400;
    else if (distance >= 30)
      timeDelay = 200;
    else if (distance >= 20)
      timeDelay = 100;
    else if (distance >= 10)
      timeDelay = 100;
    else
      timeDelay = 25;

    unsigned long currentMillisBuzzer = millis();

    if (currentMillisBuzzer - previousMillisBuzzer >= timeDelay) {
      // save the last time you blinked the LED
      previousMillisBuzzer = currentMillisBuzzer;

      // if the LED is off turn it on and vice-versa:
      if (beepState == LOW) {
        beepState = HIGH;
      } else {
        beepState = LOW;
      }

      // set the LED with the beepState of the variable:
      digitalWrite(BUZZER_PIN, beepState);
    }
  }
  else
    digitalWrite(BUZZER_PIN, LOW);
}
