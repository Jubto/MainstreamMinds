# Mainstream Minds

## Deployment/Running Instructions

To deploy/run the application there are two main ways. The first uses
docker and the second without it which requires setting up each component individual.
Read the instructions for each method below.

### Deployment with Docker

The docker based deployment requires the installation of `docker` and `docker-compose`.

Please set this up for your platform following the official documentation:
- <https://docs.docker.com/compose/install/>
- <https://docs.docker.com/compose/install/>

The application has only been tested to work using linux based containers which is what is
used on MacOS and Linux operating systems out of the box but may require additional configuration
on Windows. If this has not been setup yet on Windows check out the following Microsoft documentation
<https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start/quick-start-windows-10-linux>.

After `docker` and `docker-compose` have both been setup and are running you can now run the application.

In the root of the repository is the `docker-compose.yaml` file which defines all the services which make
up the application. To run the application open a terminal window in the root of the repository and run
the following command.

```shell
docker-compose up -d
```

Upon first launch this will trigger a build of all the images for the services but upon subsequent
runs it will not. As such if any of the source files for the backend or frontend have changed
you will need to run the build command first before running the up command as follows.

```shell
docker-compose build
docker-compose up -d
```

After the up command has been run all the services for the application should have been start.
Unless anything was changed in the `docker-compose.yaml` file you can navigate to 
<http://127.0.0.1> to see the frontend and <http://127.0.0.1:8080/docs> to view the swagger 
documentation for the backend API.

### Deployment without Docker

To deploy the application without docker you are required to setup each component individually.
To do this please go and and follow the deployment instructions for the `backend` and `frontend` in
the files `backend/README.md` and `frontend/README.md` respectively.