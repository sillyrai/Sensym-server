#ifndef SENSYM_WIFI_H
#define SENSYM_WIFI_H

#include <WiFi.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>

class SensymWiFi {
    public:
        // Constructor
        SensymWiFi(const char* ssid, const char* password, const char* server_data_url);

        // Public methods
        String init();
        void setSerialLog(bool enable);
        
        void setDataURL(const char* url);
        void setHeartbeatURL(const char* url);

        int sendTemp(const char* formattedJSONData);

        // Getters
        String getLocalIP();

    private:
        const char* _ssid;
        const char* _password;
        const char* _server_data_url;
        const char* _server_heartbeat_url;

        bool _serial_log = false;
        String _local_ip;
};

#endif
