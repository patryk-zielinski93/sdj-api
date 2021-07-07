#!/usr/bin/env python
import redis
import time
import os

# This is just a skeleton, something for you to start with.
r = None
channel = os.environ['ROOM_ID']
pubsub = None

# Function called to initialize your python environment.
# Should return 1 if ok, and 0 if something went wrong.
def ices_init():
    global r, pubsub
    r = redis.StrictRedis(host='redis', port=6379, db=0, decode_responses=True)
    pubsub = r.pubsub()
    return 1


# Function called to shutdown your python enviroment.
# Return 1 if ok, 0 if something went wrong.
def ices_shutdown():
    print 'Executing shutdown() function...'
    return 1


# Function called to get the next filename to stream.
# Should return a string.
def ices_get_next():
    global pubsub
    print 'Executing get_next() function...'
    r.publish('getNext', channel)
    message = None

    pubsub.subscribe(channel)
    PAUSE = True
    while PAUSE:
        message = pubsub.get_message()
        if message: 
            if message['data'] and not isinstance(message['data'], (int, long)):
                song_id = str(message['data'])
                next_song = '/tracks/' + song_id + '.mp3'
                PAUSE = False
        else: 
            time.sleep(1)
    return next_song

# This function, if defined, returns the string you'd like used
# as metadata (ie for title streaming) for the current song. You may
# return null to indicate that the file comment should be used.
def ices_get_metadata():
   return None


# Function used to put the current line number of
# the playlist in the cue file. If you don't care about this number
# don't use it.
# def ices_get_lineno():
#     global songnumber
#     print 'Executing get_lineno() function...'
#     songnumber = songnumber + 1
#     return songnumber
