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

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

// The TinyGPSPlus object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

int count = 0;

void setup() {
  ss.begin(GPSBaud);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(300);
  }
  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  // Limit the size of response payload to be collected in FirebaseData
  fbdo.setResponseSize(2048);

  Firebase.begin(&config, &auth);

  Firebase.reconnectWiFi(true);
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

      if (Firebase.Firestore.createDocument(&fbdo, FIREBASE_PROJECT_ID, "" /* databaseId can be (default) or empty */, documentPath.c_str(), content.raw())){
        count++;
        delay(60000);
      }
    }
  }
}