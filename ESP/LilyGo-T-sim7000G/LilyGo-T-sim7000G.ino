/// Library Import ///
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Adafruit_GFX.h>
#include "Wire.h"

#include "SensymWiFi.h"

/// THE variables ///

#define WiFi_ssid "140-1"
#define WiFi_password "EDUARDS06"
#define WiFi_serverDataEndpoint "http://192.168.1.7:3000/api/sensors/02d2b4af7e500f8b"

#define Small_Delay 10000
#define Big_Delay 60000
#define Mega_Delay 300000

#define Serial_Logging true

/// Pin variables ///

#define address 0x40
#define temp_sensor_pin 32

/// Code variables ///

char dtaUart[15];
char dtaLen = 0;

uint8_t Data[100] = {0};
uint8_t buff[100] = {0};

uint8_t buf[4] = {0};
uint16_t data, data1;
float sensor_2_temp;
float sensor_2_hum;

/// Class setup ///

OneWire oneWire(temp_sensor_pin);
DallasTemperature sensors(&oneWire);

SensymWiFi wifi(
    WiFi_ssid,
    WiFi_password,
    WiFi_serverDataEndpoint
);

/// Functions ///

uint8_t readSensor2(uint8_t reg, const void* pBuf, size_t size) {
    if (pBuf == NULL) { Serial.println("pBuf ERROR!! : null pointer"); }
    uint8_t * _pBuf = (uint8_t *)pBuf;

    Wire.beginTransmission(address);
    Wire.write(&reg, 1);
    if ( Wire.endTransmission() != 0) { return 0; }

    delay(20);
    Wire.requestFrom(address, (uint8_t) size);

    for (uint16_t i = 0; i < size; i++) { _pBuf[i] = Wire.read(); }
    
    return size;
}

/// Main logic ///

void setup() {
    Wire.begin();
    sensors.begin();

    wifi.init();

    if (Serial_Logging) {
        Serial.begin(115200);
        Serial.println("|===|=========|===========|");

        wifi.setSerialLog(true);
    }
}

void loop() {
    sensors.requestTemperatures();
    float sensor_1_temp = sensors.getTempCByIndex(0);

    // I have no idea, random ESP shenanigans
    // =======================================================
    readSensor2(0x00, buf, 4);
    data = buf[0] << 8 | buf[1];
    data1 = buf[2] << 8 | buf[3];
    sensor_2_temp = ((float)data * 165 / 65535.0) - 40.0;
    sensor_2_hum =  ((float)data1 / 65535.0) * 100;
    // =======================================================
    
    // Sensor data logging on serial
    if (Serial_Logging) {
        Serial.print("|[1]| ");
        Serial.print(sensor_1_temp);
        Serial.println("ºC |           |");

        Serial.print("|[2]| ");
        Serial.print(sensor_2_temp);
        Serial.print("ºC | ");
        Serial.print(sensor_2_hum);
        Serial.println(" %RH |");

        Serial.println("|===|=========|===========|");
    }

    // Sending data
    char FormattedJSONDataBuffer[256];                                          // Basically an empty variable (with allocated memory size)
    snprintf(FormattedJSONDataBuffer, sizeof(FormattedJSONDataBuffer),     // Write data to that empty varible
    "["
        "{\"name\":\"sensor_1_temp\",\"type\":\"temperature\",\"value\":%.2f},"
        "{\"name\":\"sensor_2_temp\",\"type\":\"temperature\",\"value\":%.2f},"
        "{\"name\":\"sensor_2_hum\",\"type\":\"humidity\",\"value\":%.2f}"
    "]", 
    sensor_1_temp, sensor_2_temp, sensor_2_hum);

    int res = wifi.sendTemp(FormattedJSONDataBuffer);

    // Delay
    delay(Big_Delay);
}
