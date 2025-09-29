/*
 * ESP8266 wifi module Interfacing with Arduino Uno
 * http://www.electronicwings.com
 */ 
 
#include "ESP8266_AT.h"

/* Select Demo */
#define RECEIVE_DEMO			/* Define RECEIVE demo */


/* Define Required fields shown below */
#define DOMAIN          "https://reqres.in"
#define PORT            "443"



#define SSID            "TakacsRezidencia"
#define PASSWORD        "TakacsPereta136"

char _buffer[150];
uint8_t Connect_Status;


void setup() {
    Serial.begin(115200);
 
    while(!ESP8266_Begin());
    ESP8266_WIFIMode(BOTH_STATION_AND_ACCESPOINT);	/* 3 = Both (AP and STA) */
    ESP8266_ConnectionMode(SINGLE);     			/* 0 = Single; 1 = Multi */
    ESP8266_ApplicationMode(NORMAL);    			/* 0 = Normal Mode; 1 = Transperant Mode */
    if(ESP8266_connected() == ESP8266_NOT_CONNECTED_TO_AP)/*Check WIFI connection*/
    ESP8266_JoinAccessPoint(SSID, PASSWORD);		/*Connect to WIFI*/
    ESP8266_Start(0, DOMAIN, PORT);	
}

void loop() {
    Connect_Status = ESP8266_connected();
    if(Connect_Status == ESP8266_NOT_CONNECTED_TO_AP)	/*Again check connection to WIFI*/
    ESP8266_JoinAccessPoint(SSID, PASSWORD);			/*Connect to WIFI*/
    if(Connect_Status == ESP8266_TRANSMISSION_DISCONNECTED)
    ESP8266_Start(0, DOMAIN, PORT);						/*Connect to TCP port*/


    
    #ifdef RECEIVE_DEMO
    memset(_buffer, 0, 150);
    sprintf(_buffer, "GET /api/users/1"); /*Connect to thingspeak server to get data using your channel ID*/
    ESP8266_Send(_buffer);
    Read_Data(_buffer);
    delay(600);
    #endif
  }