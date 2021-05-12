#!/bin/sh
twistd3 -n web --https=443 --path . -c '/etc/letsencrypt/live/api.ingametoken.xyz/cert.pem' -k '/etc/letsencrypt/live/api.ingametoken.xyz/privkey.pem' 
