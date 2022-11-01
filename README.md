# Awesome Project Build with TypeORM

## Requirements

- You must have Docker installed.
- You must have a connection established with the Internet.

### Windows
- If you are on Windows, you must have Chocolatey installed with "make" added to it. Instructions for downloading & installing Chocolatey available at https://chocolatey.org/install.

After installing Chocolatey, run:
```
choco install make
```

Commands to turn the project up: 

1. `make env` -> Creates the environment file with default values for necessary variables. Only run this once so you can edit the values in the .env file after.
2. `make image` -> Creates the "sessionapi" image to use in the `docker-compose.yml` file.
3. `make up` -> Starts the MongoDB container and the SessionAPI container to work together.

To teardown the containers, enter `make down`.