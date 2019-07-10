#!/usr/bin/env bash
sed -i -- "s/{{ROOM_ID}}/$ROOM_ID/g" /ices/ices.conf
# npm install --prefix /api
# npm start --prefix /api &>/dev/null &
/usr/local/bin/ices -c /ices/ices.conf
