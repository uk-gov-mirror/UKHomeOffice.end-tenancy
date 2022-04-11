A# End Tenancy

[![Docker Repository on Quay.io](https://quay.io/repository/ukhomeofficedigital/end-tenancy/status "Docker Repository on Quay.io")](https://quay.io/repository/ukhomeofficedigital/end-tenancy) [![Build Status](https://travis-ci.org/UKHomeOffice/end-tenancy.svg?branch=master)](https://travis-ci.org/UKHomeOffice/end-tenancy)

This project is built with [HOF-Bootstrap](https://github.com/UKHomeOffice/hof-bootstrap) and uses [Docker](https://www.docker.com/).

## Getting started

Get the project from Github.
```bash
$ git clone git@github.com:UKHomeOffice/end-tenancy.git && cd end-tenancy
```

Install the dependencies and build the project resources
```bash
$ npm install
```

You'll also need a pdf-generator to the run the app fully end to end.  The recommended one is https://github.com/UKHomeOffice/html-pdf-converter.

You'll need to set the port number accordingly with the pdf generator.  In docker you set the port number, `docker run -p 8080:8001 [image-name]`

You'll then need to set an environment variable for the end-tenancy app

`PDF_CONVERTER_URL=http://localhost:8001/convert`


[Install Docker Compose](https://docs.docker.com/compose/install/)

Run the services locally with Docker Compose
```bash
$ docker-compose up
```

Run the services locally outside of Docker Compose (You'll need [Redis](http://redis.io/) for this)
```bash
$ npm run dev
```

For anything else end-tenancy-related, look in [package.json](./package.json) for a full list of scripts etc, and
[config.js](./config.js) for environment variables.

Otherwise, see [HOF-Bootstrap](https://github.com/UKHomeOffice/hof-bootstrap).
