#!/usr/bin/env bash
npm install --prefix /api
npm start --prefix /api &>/dev/null &
/usr/local/bin/ices -c /ices/ices.conf
