CREATE TABLE products (id serial, title VARCHAR(255) NOT NULL, price NUMERIC(5, 2) NOT NULL, image_url VARCHAR(255) NOT NULL, productURL VARCHAR(255) NOT NULL, dept_id INT NOT NULL, brand_id INT NOT NULL);
COPY products(title, brand_id, dept_id, price, image_url, producturl) from '/db/data/random-data.csv' delimiter ',' csv header;

CREATE TABLE brands (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);
COPY brands(name) from '/db/data/brands.csv' delimiter '|' CSV;

CREATE TABLE departments (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);
COPY departments(name) from '/db/data/departments.csv' delimiter ',' CSV;

ALTER TABLE products add foreign key (dept_id) references departments (id), add foreign key (brand_id) references brands (id), add primary key (id);
CREATE INDEX ON products (brand_id);
CREATE INDEX ON products (dept_id);



