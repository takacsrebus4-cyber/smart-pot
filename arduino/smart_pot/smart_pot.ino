#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <Wire.h>
#include <BH1750.h>

#include "WiFiS3.h"
#include "WiFiSSLClient.h"
#include "IPAddress.h"

#include "arduino_secrets.h"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

int status = WL_IDLE_STATUS;
char server[] = "smartpot.taki02.org";

WiFiSSLClient client;

BH1750 lightMeter;

#define DHTPIN 7
#define DHTTYPE DHT22

DHT_Unified dht(DHTPIN, DHTTYPE);

const int AirValue = 670;    //determined by measuring the avarege value measured over 2 hours while sensor in air
const int WaterValue = 430;  ////determined by measuring the avarege value measured over 2 hours while sensor in water
int soilMoistureValue = 0;
int mappedSoilMoisture = 0;
int timer = 0;
float prev_light = 0;
float prev_temperature = 0;
float prev_humidity = 0;
float prev_moisture = 0;
float marginOfError = 0.2;  //marging of error is 20%
float light_diff = 0;       //the difference between the current and previously measured light
float temperature_diff = 0;
float humidity_diff = 0;
float moisture_diff = 0;

uint32_t delayMS;



void setup() {

  Serial.begin(115200);
  while (!Serial) {
    ;
  }

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    while (true)
      ;
  }
  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  connectToWifi();

  Wire.begin();
  lightMeter.begin();
  dht.begin();
}




void loop() {

  delay(5000);

  //increase timer
  timer = timer + 5000;

  // Get temperature event and print its value.
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  float temperature = event.temperature;
  if (isnan(temperature)) {
    Serial.println(F("Error reading temperature!"));
  } else {
    Serial.print(F("Temp: "));
    Serial.print(temperature);
    Serial.println(F("°C"));
  }

  // Get humidity event and print its value.
  dht.humidity().getEvent(&event);
  float humidity = event.relative_humidity;
  if (isnan(humidity)) {
    Serial.println(F("Error reading humidity!"));
  } else {
    Serial.print(F("Humi: "));
    Serial.print(humidity);
    Serial.println("%");
  }

  //measurng light
  float light = lightMeter.readLightLevel();
  Serial.print("Light: ");
  Serial.print(light);
  Serial.println(" lx");

  //measureing soil moisture
  int soilMoistureValue;
  soilMoistureValue = analogRead(0);
  Serial.println("Analog: " + String(soilMoistureValue));

  mappedSoilMoisture = map(soilMoistureValue, AirValue, WaterValue, 0, 1023);

  if (mappedSoilMoisture > 100) {
    mappedSoilMoisture = 100;
  } else if (mappedSoilMoisture < 0) {
    mappedSoilMoisture = 0;
  }

  Serial.print("Soil Moisture: ");
  Serial.println(mappedSoilMoisture);






  Serial.println("Timer: " + String(timer));

  //send data to server after 1 minute or if the difference between current and previously measured data exceeds the marging of error
  //if (timer >= 60000) {
    upload_data(light, mappedSoilMoisture, temperature, humidity);
    timer = 0;
  //}


  prev_light = light;
  prev_temperature = temperature;
  prev_humidity = humidity;
  prev_moisture = mappedSoilMoisture;
}




void connectToWifi() {
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);

    delay(10000);
  }
  printWifiStatus();
}




void printWifiStatus() {
  /* -------------------------------------------------------------------------- */
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}





void read_response() {
  /* -------------------------------------------------------------------------- */
  uint32_t received_data_num = 0;
  while (client.available()) {
    char c = client.read();
    Serial.print(c);
    received_data_num++;
    if (received_data_num % 80 == 0) {
      Serial.println();
    }
  }
}




void upload_data(float light, int moisture, float temperature, float humidity) {

  String light_st = String(light);
  String moisture_st = String(moisture);
  String temperature_st = String(temperature);
  String humidity_st = String(humidity);

  String jsonData = "{\"light\":" + light_st + ",\"moisture\":" + moisture_st + ",\"temperature\":" + temperature_st + ",\"humidity\":" + humidity_st + ",\"current_plant_id\":3}";


  Serial.println("\nStarting connection to server...");

  if (client.connect(server, 443)) {
    Serial.println("connected to server");

    Serial.println(jsonData);

    // Make a HTTP request:
    client.println("POST /upload/data HTTP/1.1");
    client.println("Host: " + String(server));
    client.println("Content-Type: application/json");
    client.println("Connection: close");
    client.print("Content-Length: ");
    client.println(jsonData.length());
    client.println();

    // Send JSON body
    client.println(jsonData);

    Serial.println("Request sent");
    Serial.println("Waiting for response...");
    read_response();

    client.flush();
    client.stop();

  } else {
    Serial.println("connection failed");
    if (WiFi.disconnect()) {
      Serial.println("Wifi disconnected");
    } else {
      Serial.println("Wifi disconnect failed");
    }
    delay(10000);
    connectToWifi();
  }
}
