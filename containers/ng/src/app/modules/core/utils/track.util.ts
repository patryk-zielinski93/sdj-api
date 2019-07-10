import { Track } from "app/common/interfaces/track.interface";

export namespace TrackUtil {
  export function getTrackThumbnail(track: Track): string {
    return "https://img.youtube.com/vi/" + track.id + "/mqdefault.jpg";
  }
}
