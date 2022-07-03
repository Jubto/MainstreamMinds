## Poetry

Poetry documentation: `https://python-poetry.org/docs/`

```shell
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
```

If you want poetry to create virtual environments in the project directory (helps with locating interpreter for IDEs), run:
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

## Running the project

To run the backend use the following `uvicorn app.main:app --reload` which runs
the app with hot reloading enabled.

If you get the issue `uvicorn is not a recognised command` or similar
then try running the backend using `poetry run python3 -m uvicorn app.main:app --reload`