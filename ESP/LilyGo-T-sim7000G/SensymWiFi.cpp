#include "SensymWiFi.h"

SensymWiFi::SensymWiFi(const char* ssid,
                       const char* password,
                       const char* server_data_url)
    : _ssid(ssid),
    _password(password),
    _server_data_url(server_data_url)
{}

// Changing Values
void SensymWiFi::setSerialLog(bool enable) {
    _serial_log = enable;
}
void SensymWiFi::setDataURL(const char* url) {
    _server_data_url = url;
}
void SensymWiFi::setHeartbeatURL(const char* url) {
    _server_heartbeat_url = url;
}

// Initialization
String SensymWiFi::init() {
    WiFi.begin(_ssid, _password);

    if (_serial_log) {
        Serial.print("Connecting to WiFi");
    }

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        if (_serial_log) {
            Serial.print(".");
        }
    }

    _local_ip = WiFi.localIP().toString();

    if (_serial_log) {
        Serial.print("\nConnected! IP address: ");
        Serial.println(_local_ip);
    }

    return _local_ip;
}

// Sending Data
int SensymWiFi::sendTemp(const char* formattedJSONData) {
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;

        http.begin(client, _server_data_url);
        http.addHeader("Content-Type", "application/json");
        
        int httpResponseCode = http.POST(formattedJSONData);

        if (httpResponseCode > 0 && _serial_log) {
            Serial.print("HTTP Response code: ");
            Serial.println(httpResponseCode);

        } else if (_serial_log) { 
            Serial.print("Error code: ");
            Serial.println(httpResponseCode);
        }

        http.end();
        return httpResponseCode;
    } else {
        if (_serial_log) { Serial.println("WiFi Disconnected"); }
        return 0;
    }
}

// Getting Values
String SensymWiFi::getLocalIP() {
    return _local_ip;
}
