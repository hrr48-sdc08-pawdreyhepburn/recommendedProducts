# recommendedProducts

This is the main repository for the tarjay recommended products microservice, which agglomerates related products into one carousel.

The service & database are built with a cloud native mindset and are containerized for easy deployment and horizontal scaling. 

The service & db are both built with ec2 micro instances in mind.

## Spinning up the DB

The database is a PostgreSQL db containing ~10 million records. It is capable of supporting full CRUD, but the service api currently supports read & write capabilities. Boot this up on an ec2 micro, but extend the volume to 16gb to ensure sufficient space.

You can spin up a fully running db with the following command: 

`sudo docker run -e POSTGRES_PASSWORD=YOUR_SECRET_PASSWORD -e POSTGRES_DB=sdc -p 5432:5432 --mount target=/app-data -d augustdolan/sdc-db`

The only thing you need to customize is your own password. This command will boot up and seed the database with 10 million records for you. Once you get the green light that everything is finished, you can query the database.

## Spinning up the Service

The docker container can be run with the following command:

`sudo docker run -e POSTGRES_PASSWORD=YOUR_SECRET_PASSWORD -e POSTGRES_URL=YOUR_DBS_URL -e NEWRELIC_KEY=YOUR_NEWRELIC_KEY -e LOADER_IO_KEY=YOUR_LOADERIO_KEY -p 3003:3003 -d augustdolan/sdc-backend:latest`

Of note:
`POSTGRES_PASSWORD` should be the password you set up for your db
`POSTGRES_URL` is the IP address that your db is on (ports are handled for you)
`NEWRELIC_KEY` is an optional key to hook your app's performance data up to a new relic APM.
`LOADER_IO_KEY` is an optional key to hook up the backend to a load tester.

This service listens on port 3003.

### Horizontal Scaling with Nginx

At 4 ec2 services this application is capable of handling between 1200-1500 RPS with an average latency of about 80ms. Horizontal scaling is as easy as spinning up a new container with the _same_ variables on more ec2 instances. The only thing left is to create a load balancer. You can either use the AWS balancer, or for a simple, but further optimized load balancer you can create a further ec2 instance, download nginx, and place this in your `/etc/nginx/nginx.conf`:

`user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
    multi_accept on;
    use epoll;
}

worker_rlimit_nofile 20000;
http {
  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  keepalive_timeout 15;
  proxy_cache_path /tmp/cache levels=1:2 keys_zone=cache:60m max_size=1G;

  upstream sdc {
    server IP_1:3003;
    server IP_2:3003;
    server IP_3:3003;
    server IP_4:3003;
  }

  server {
    listen 80;
    location / {
      proxy_pass http://sdc;
      proxy_redirect off;
      proxy_set_header X-Forwarded-For $remote_addr;
      proxy_buffering on;
      proxy_buffer_size 128k;
      proxy_buffers 100 128k;
    }
  }
}
`
