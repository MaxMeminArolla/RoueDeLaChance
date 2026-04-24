#!/bin/bash
cd ~/RoueDeLaChance
git stash
git pull origin main
docker stop MaRoue ; docker rm MaRoue
docker build -t roue-chance .
docker run -d \
  --name MaRoue \
  --restart always \
  -e TZ=Europe/Paris \
  -p 8080:8080 \
  -v /root/appsettings.json:/app/appsettings.json \
  -v /root/spin-history.json:/app/spin-history.json \
  -v /root/spins-export.csv:/app/spins-export.csv \
  roue-chance
