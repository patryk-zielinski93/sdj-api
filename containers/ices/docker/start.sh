#!/usr/bin/env bash
sed -i -- "s/{{ROOM_ID}}/$ROOM_ID/g" /ices/ices.conf
/usr/local/bin/ices -c /ices/ices.conf
