#!/bin/sh
twistd3 -n web --https=443 --path . -c '/etc/letsencrypt/live/ingamecoin.xyz/cert.pem' -k '/etc/letsencrypt/live/ingamecoin.xyz/privkey.pem' 
