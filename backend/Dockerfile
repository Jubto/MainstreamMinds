FROM python:3.8

WORKDIR /srv/www

# Install poetry
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -

COPY pyproject.toml /srv/www/pyproject.toml
COPY poetry.lock /srv/www/poetry.lock
RUN poetry use 3.8
RUN poetry install

COPY app /srv/www/app

CMD ["uvicorn", "app.main:app", "--proxy-headers", "--host", "0.0.0.0", "--port", "8080"]