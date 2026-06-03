# Sensym

## Server
### Server .env variables
```
MONGODB_URI = "mongodb://<USER>:<PASS>@<HOST+PORT>/<DATABASE>?authSource=<DATABASE>"

PORT = 3000
NODE_ENV = "development" # 'deployment'

JWT_SECRET = "<secret_string>"
```

### Server endpoint structure

- `GET` `/` Frontend main site page 
- `GET` `/login` Frontend page for user login
- `GET` `/register` Frontend page for user registering
- `GET` `/sensors` Returns all sensors in the database
- `GET` `/analytics` Analytics stuff
- `GET` `/data` Sensor data view
- `/api/`
	- `/auth/`
		- `GET`    `/` View current user info
		- `POST`   `/register` Register a new user
		- `POST`   `/login` Login into an existing account
		- `DELETE` `/delete-account `Delete an account
		- `PATCH`  `/change-username` Change an accounts username
		- `PATCH`  `/change-password` Change an accounts password
	- `/sensors/`
		- `POST` `/newSensor` Creates a new sensor entry in the database and returns an auth token for it
		- `POST` `/:sensorToken` Posts new statistics data as a sensor
		- `DELETE` `/:sensorToken` Deletes the device from the database
		- `POST`   `/:sensorToken/heartbeat` Sends a heatbeat to the server from the device
	- `GET` `/serverData` Returns information about the server
	- 