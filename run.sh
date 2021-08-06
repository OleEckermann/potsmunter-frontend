#!/bin/bash
docker build -t mpt/frontend .
docker stop mpt-frontend
docker rm mpt-frontend
docker run --name mpt-frontend --net mpt -p 8081:80 --restart always -d mpt/frontend