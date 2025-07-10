#!/bin/bash

domain=mytasksproject.duckdns.org
rsa_key_size=4096
data_path="./certbot"
email="premier674@gmail.com" # Change this to your email

if [ ! -e "${data_path}/conf/options-ssl-nginx.conf" ] || [ ! -e "${data_path}/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "${data_path}/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "${data_path}/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "${data_path}/conf/ssl-dhparams.pem"
  echo
fi

echo "### Creating dummy certificate for ${domain} ..."
path="${data_path}/conf/live/${domain}"
mkdir -p "${path}"
docker-compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:${rsa_key_size} -days 1 \
    -keyout '${path}/privkey.pem' \
    -out '${path}/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo

echo "### Starting nginx ..."
docker-compose up --force-recreate -d nginx
echo

echo "### Deleting dummy certificate for ${domain} ..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/${domain} && rm -Rf /etc/letsencrypt/archive/${domain} && rm -Rf /etc/letsencrypt/renewal/${domain}.conf" certbot
echo

echo "### Requesting Let's Encrypt certificate for ${domain} ..."
#Join ${domain} to -d args
docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email ${email} \
    -d ${domain} \
    --rsa-key-size ${rsa_key_size} \
    --agree-tos \
    --force-renewal" certbot
echo

echo "### Reloading nginx ..."
docker-compose exec nginx nginx -s reload
