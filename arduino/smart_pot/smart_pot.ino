// DHT Temperature & Humidity Sensor
// Unified Sensor Library Example
// Written by Tony DiCola for Adafruit Industries
// Released under an MIT license.

// REQUIRES the following Arduino libraries:
// - DHT Sensor Library: https://github.com/adafruit/DHT-sensor-library
// - Adafruit Unified Sensor Lib: https://github.com/adafruit/Adafruit_Sensor

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <Wire.h>
#include <BH1750.h>

#include "WiFiS3.h"
#include "WiFiSSLClient.h"
#include "IPAddress.h"

#include "arduino_secrets.h"

char ssid[] = SECRET_SSID;  // your network SSID (name)
char pass[] = SECRET_PASS;  // your network password (use for WPA, or use as key for WEP)

int status = WL_IDLE_STATUS;
// if you don't want to use DNS (and reduce your sketch size)
// use the numeric IP instead of the name for the server:
//IPAddress server(74,125,232,128);  // numeric IP for Google (no DNS)
char server[] = "smartpot.taki02.org";  // name address for Google (using DNS)

/*
char light_st[] = "";
char moisture_st[] = "";
char temperature_st[] = "";
char humidity_st[] = "";*/

// Initialize the Ethernet client library
// with the IP address and port of the server
// that you want to connect to (port 80 is default for HTTP):
WiFiSSLClient client;

BH1750 lightMeter;

#define DHTPIN 7  // Digital pin connected to the DHT sensor
// Feather HUZZAH ESP8266 note: use pins 3, 4, 5, 12, 13 or 14 --
// Pin 15 can work but DHT must be disconnected during program upload.

// Uncomment the type of sensor in use:
//#define DHTTYPE    DHT11     // DHT 11
#define DHTTYPE DHT22  // DHT 22 (AM2302)
//#define DHTTYPE    DHT21     // DHT 21 (AM2301)

// See guide for details on sensor wiring and usage:
//   https://learn.adafruit.com/dht/overview

DHT_Unified dht(DHTPIN, DHTTYPE);

uint32_t delayMS;

void setup() {

  /* -------------------------------------------------------------------------- */
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  while (!Serial) {
    ;  // wait for serial port to connect. Needed for native USB port only
  }
  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true)
      ;
  }
  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }
  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network.
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }
  printWifiStatus();


  Wire.begin();
  lightMeter.begin();
  dht.begin();
}

void loop() {
  // Delay between measurements.
  delay(5000);

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
  //wet: 370-450 / moist: 440-520 / medium: 510-600 / lightly wet: 590-670 / dry: 660-750
  int moisture;
  moisture = analogRead(0);  //connect sensor to Analog 0
  Serial.print("Moisture: ");
  Serial.println(moisture);


//sending data to server
  Serial.println("\nStarting connection to server...");
  // if you get a connection, report back via serial:
  if (client.connect(server, 443)) {
    Serial.println("connected to server");
    upload_data(light, moisture, temperature, humidity);
  } else {
    Serial.println("connection failed");
  }
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
    /* actual data reception */
    char c = client.read();
    /* print data to serial port */
    Serial.print(c);
    /* wrap data to 80 columns*/
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
  
  //String jsonData = "{\"light\":" + String(23.6) + ",\"moisture\":" + String(550) + ",\"temperature\":" + String(32.00) + ",\"humidity\":" + String(65.10) + ",\"current_plant_id\":3}";

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
}
