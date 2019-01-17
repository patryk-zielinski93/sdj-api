SELECT *, COUNT(queued_track.trackId) as count
FROM queued_track
       LEFT JOIN track on queued_track.trackId = track.id
WHERE randomized = 0
GROUP BY queued_track.trackId
ORDER BY count DESC;