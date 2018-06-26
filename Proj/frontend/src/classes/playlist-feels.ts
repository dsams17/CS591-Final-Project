import {PlaylistFeelsInterface} from "./playlist-feels-interface";

export class PlaylistFeels{

  sentiment: string;
  gif: string;

  constructor( sentiment: string = '', gif: string = '') {

    this.sentiment = sentiment;
    this.gif = gif;
  }
}
