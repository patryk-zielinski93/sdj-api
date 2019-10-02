#!/usr/bin/env bash

BACKEND_URL="${BACKEND_URL//\//\\\/}"
NG_EXTERNAL_STREAM="${NG_EXTERNAL_STREAM//\//\\\/}"
RADIO_STREAM_URL="${RADIO_STREAM_URL//\//\\\/}"
SLACK_CLIENT_ID="${SLACK_CLIENT_ID//\//\\\/}"
SLACK_CLIENT_SECRET="${SLACK_CLIENT_SECRET//\//\\\/}"

for f in /usr/share/nginx/html/env.js; do
    sed -i -- "s/{{backendUrl}}/${BACKEND_URL}/g" "${f%}"
    sed -i -- "s/{{radioStreamUrl}}/${RADIO_STREAM_URL}/g" "${f%}"
    sed -i -- "s/{{externalStream}}/${NG_EXTERNAL_STREAM}/g" "${f%}"
    sed -i -- "s/{{slackClientId}}/${SLACK_CLIENT_ID}/g" "${f%}"
    sed -i -- "s/{{slackClientSecret}}/${SLACK_CLIENT_SECRET}/g" "${f%}"
    echo "${f%}"
done

exec "$@"
