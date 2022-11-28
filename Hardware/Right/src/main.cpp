#include <Arduino.h>

#define TRIG_PIN 8    // Chân Trig nối với chân 8
#define ECHO_PIN 7    // Chân Echo nối với chân 7
#define BUZZER_PIN 13
#define TIME_OUT 50000 // Time_out của pulseIn là 5000 microsecond


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
 
void setup() {  
  Serial.begin(9600);
 
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT); // Set buzzer - pin 9 as an output
}
int duty = 64;
int distanceBuffer=0;
int timeDelay = 750;
int warning = 0;
void loop() {
  // gọi chương trình con getDistance
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