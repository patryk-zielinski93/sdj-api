#!/usr/bin/env bash

BACKEND_URL="${BACKEND_URL//\//\\\/}"
RADIO_STREAM_URL="${RADIO_STREAM_URL//\//\\\/}"

for f in /usr/share/nginx/html/env.js; do
    sed -i -- "s/{{backendUrl}}/${BACKEND_URL}/g" "${f%}"
    sed -i -- "s/{{radioStreamUrl}}/${RADIO_STREAM_URL}/g" "${f%}"
    echo "${f%}"
done

exec "$@"
