FROM postgres:latest AS sdc

COPY ./docker-entrypoint-initdb.d /docker-entrypoint-initdb.d

ENV POSTGRES_PASSWORD=Gohan123 POSTGRES_DB=sdc

WORKDIR /db

VOLUME /app-data

EXPOSE 5432


COPY . .


# RUN psql -U postgres -p