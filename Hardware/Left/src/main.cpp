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
}