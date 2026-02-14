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
