FROM postgres:latest AS sdc

COPY ./docker-entrypoint-initdb.d /docker-entrypoint-initdb.d

WORKDIR /db

# Create your own env vars for: POSTGRES_PASSWORD & POSTGRES_DB=

VOLUME /app-data

EXPOSE 5432:5432

COPY . .
