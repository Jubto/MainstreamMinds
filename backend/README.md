# Backend Deployment/Running Instructions

To deploy/run the backend without using docker follow all the instructions listed below.

## Poetry - Installation

Poetry documentation: `https://python-poetry.org/docs/`

```shell
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
```

If you want poetry to create virtual environments in the project directory (helps with locating interpreter for IDEs),
run:

```shell
poetry config virtualenvs.in-project true
```

To create a virtual environment using `poetry` run:

```shell
poetry env use python3
poetry env list
```

To install the required packages run `poetry install` in the root folder of the backend
where the `pyproject.toml` file is.

To add dependencies use `poetry add <dependency-name>`.

## Setting up

The server requires a file `.env.local` in the backend root folder in order to determine which
database type to use (sqlite - flatfile, or PostgreSQL - server) and how to connect to it. The
`DB_CONN` variable in this file determines the database connection string.

If you just want to run the server locally, copy the sample env file with `cp .env.sample .env.local`
and then uncomment the 2nd line with the sqlite connection string.

### Redis

Install Redis using the [docs](https://redis.io/docs/getting-started/installation/) and then run:

```shell
redis-server --daemonize yes
```

This will run the redis server with the in-built default [config](https://redis.io/docs/manual/config/).
The Redis server needs to be running whenever the backend server is running. You can check it is running with:

```shell
redis-cli ping
```

Shutdown the Redis server with:

```shell
redis-cli shutdown
```

Clear Redis (ie clear trending cache) with

```shell
redis-cli
> FLUSHDB
```

By default, the backend will connect to a default configured redis database (running on
localhost, port `6379`). If you want to change this, the url and port can be specified
in the `REDIS_CONN` environment variable. See the example in `.env.sample`.

## Running the project

To run the backend use the following `uvicorn app.main:app --reload` which runs
the app with hot reloading enabled.

If you get the issue `uvicorn is not a recognised command` or similar
then try running the backend using `poetry run python3 -m uvicorn app.main:app --reload`

## Docs

The swagger documentation can be accessed at <https://127.0.0.1:8000/docs>

## Populating the database

Once the project is running, you can populate the database by running the api/populate route
at https://127.0.0.1:8000/docs
The populate route gives:

- 40 institutions
- 60 researchers (assigned to an institution)
- Up to 188 stories (and creates all tags associated with those stories)
  For speed you can limit the number of stories you add to the database with the query parameter.
  Any query paramater over 188 will just upload all 188 stories.

**Ensure that the database is empty before hitting the populate button.**

DISCLAIMER
The videos contained in this mock data are meant for demonstration purposes only.
Unfortunately the data we were able to easily access does not perfectly align with our vision for the product.
