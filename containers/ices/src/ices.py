#!/usr/bin/env python
import redis
import time

# This is just a skeleton, something for you to start with.
r = None
silence = '/tracks/10-sec-of-silence.mp3'
last_song = ''


# Function called to initialize your python environment.
# Should return 1 if ok, and 0 if something went wrong.
def ices_init():
    global r, silence
    r = redis.StrictRedis(host='redis', port=6379, db=0)
    r.set('next_song', '10-sec-of-silence')
    return 1


# Function called to shutdown your python enviroment.
# Return 1 if ok, 0 if something went wrong.
def ices_shutdown():
    print 'Executing shutdown() function...'
    return 1


# Function called to get the next filename to stream.
# Should return a string.
def ices_get_next():
    global silence, last_song
    print 'Executing get_next() function...'
    song_id = r.get('next_song')
    next_song = '/tracks/' + song_id + '.mp3'
    if not song_id or next_song == last_song:
        r.publish('getNext', 'getNext')
        time.sleep(1)
        song_id = r.get('next_song')
        next_song = '/tracks/' + song_id + '.mp3'
    received_new_song = True if song_id and next_song != last_song else False
    last_song = next_song if received_new_song else last_song
    return next_song if received_new_song else silence

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
