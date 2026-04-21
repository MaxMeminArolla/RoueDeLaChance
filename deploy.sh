#!/bin/bash
cd RoueDeLaChance
git pull origin main
docker stop MaRoue ; docker rm MaRoue
docker build -t roue-chance .
docker run -d --name MaRoue --restart always -p 8080:8080 roue-chance
