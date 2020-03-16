#!/usr/bin/env bash
ng build backend
pm2 start pm2.json
pm2 logs
