import { getVideoID } from "../utils";
import YouTubePlayer from "youtube-player";
import { YouTubePlayer as YouTubePlayerType } from "youtube-player/dist/types";

export default class VideoManager {
  public static player: YouTubePlayerType;
  public static initialized = false;

  public static init(url: string, domId: string) {
    const id = getVideoID(url);

    this.player = YouTubePlayer(domId);
    this.player.loadVideoById(id);
    this.initialized = true;
  }
}
