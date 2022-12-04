#include <Arduino.h>
#include "TimerOne.h"

#define TRIG_PIN 8 // Chân Trig nối với chân 8
#define ECHO_PIN 7 // Chân Echo nối với chân 7
#define BUZZER_PIN 13
#define TIME_OUT 50000 // Time_out của pulseIn là 5000 microsecond
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
  pinMode(BUZZER_PIN, OUTPUT); // Set buzzer - pin 9 as an output
}

void loop()
{
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
    delay(timeDelay);
    digitalWrite(BUZZER_PIN, LOW);
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
  // Chờ 1s và lặp lại cu kỳ trên
  // delay(1000);
  distanceBuffer = distance;
}