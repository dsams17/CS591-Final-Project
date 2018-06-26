import {PlaylistFeelsInterface} from "./playlist-feels-interface";

export class PlaylistFeels{

  playlistname: string;
  sentiment: string;
  gif: string;

  constructor(playlistname: string = '', sentiment: string = '', gif: string = '') {

    this.playlistname = playlistname;
    this.sentiment = sentiment;
    this.gif = gif;
  }
}
