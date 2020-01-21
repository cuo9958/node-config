#!/bin/sh

docker run --env NODE_ENV=development -d -p 8200:8200 node_config
