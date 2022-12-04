#include <firebase_func.h>

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
// The TinyGPSPlus object
TinyGPSPlus gps;

void IRAM_ATTR FirebaseGPS(){
    // Serial.println("OK\n");
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


void configFirebase(){
    Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

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