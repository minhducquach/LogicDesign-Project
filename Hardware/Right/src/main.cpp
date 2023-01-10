#include <Arduino.h>
#include "TimerOne.h"

#define TRIG_PIN 3 // Chân Trig nối với chân 3
#define ECHO_PIN 2 // Chân Echo nối với chân 2
#define BUZZER_PIN 8
#define TIME_OUT 100000 // Time_out của pulseIn là 5000 microsecond
#define TIMER_CYCLE 10

int duty = 64;
int distanceBuffer = 0;
int timeDelay = 750;
int warning = 0;

// Chương trình con tính khoảng cách
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
  Serial.begin(9600);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT); // Set buzzer - pin 8 as an output
}


unsigned long previousMillisBuzzer = 0;
unsigned long previousMillisGPS = 0;

int beepState = LOW;

void loop()
{
  // gọi chương trình con getDistance
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
      // save the last time the buzzer's state changed
      previousMillisBuzzer = currentMillisBuzzer;

      // if the buzzer is off turn it on and vice-versa:
      if (beepState == LOW) {
        beepState = HIGH;
      } else {
        beepState = LOW;
      }

      // set the buzzer with the beepState of the variable:
      digitalWrite(BUZZER_PIN, beepState);
    }
  }
  else
    digitalWrite(BUZZER_PIN, LOW);
}
}
