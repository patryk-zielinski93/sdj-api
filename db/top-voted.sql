SELECT `track`.*, COUNT(track.id) as 'count'
FROM `track` `track`
       INNER JOIN `queued_track` `queuedTrack` ON `queuedTrack`.`trackId` = `track`.`id`
       LEFT JOIN `vote` `vote` ON `vote`.`trackId` = `queuedTrack`.`id`
WHERE `vote`.`value` > 0
group by track.id
ORDER BY count DESC