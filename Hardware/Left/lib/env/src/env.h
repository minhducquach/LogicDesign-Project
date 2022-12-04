#ifndef __ENV_H__
#define __ENV_H__

#include <Arduino.h>
#include <WiFi.h>
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>

#define WIFI_SSID "TP-LINK_D474"
#define WIFI_PASSWORD "thanhcodau"

#define API_KEY "AIzaSyDkRstzRmdQz6g-ij4V6lG8lw_fddBiAis"

#define FIREBASE_PROJECT_ID "logicdesign-project"

#define USER_EMAIL "samplefammember@gmail.com"
#define USER_PASSWORD "sampleuser"

#define TRIG_PIN 16    // Chân Trig nối với chân 8
#define ECHO_PIN 17    // Chân Echo nối với chân 7
#define BUZZER_PIN 19
#define TIME_OUT 50000 // Time_out của pulseIn là 5000 microsecond

#endif