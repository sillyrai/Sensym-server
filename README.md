# Sensym

## ESP sensor

...

## Server
### Server .env variables
```
DB_USER = "user"
DB_PASS = "password"
DB_LINK = "localhost:27017"
DB_NAME = "sensym"

PORT = 3000

# Optional: Set to "production" in a real deployed environment
NODE_ENV="development" # 'deployment'
```
### Server endpoint structure

site.com/
- /login
- /register
- /device
	- /devices
	- /config
- /api
	- /database
	- /analytics
	- /auth
		- /register
		- /login
	- /sensors
- /test
