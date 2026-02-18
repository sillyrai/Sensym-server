# Sensym

## ESP sensor

...

## Server
### Server .env variables
```
DB_URL = "mongodb://<USER>:<PASS>@<HOST+PORT>/<DATABASE>?authSource=<DATABASE>"

PORT = 3000

NODE_ENV="development" # 'deployment'
```

### Server endpoint structure
site.com/
- GET /login `Frontend page for user login`
- GET /register `Frontend page for user registering`
- GET /sensors `Returns all sensors in the database`
- GET /analytics `Analytics stuff`
- GET /data `Sensor data view`
- /api/
	- /auth/
		- GET    / `View current user info`
		- POST   /register `Register a new user`
		- POST   /login `Login into an exist`
		- DELETE /delete-account `Delete an account`
		- PATCH  /change-username `Change an accounts username`
		- PATCH  /change-password `Change an accounts password`
	- /sensors/
		- /newSensor `Creates a new sensor entry in the database and returns an auth token for it`
		- POST   /:sensorToken `Posts new statistics data as a sensor`
		- DELETE /:sensorToken `Deletes the device from the database`
		- POST   /:sensorToken/heartbeat `Sends a heatbeat to the server from the device`
	- /serverData `Returns information about the server`