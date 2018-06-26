import {PlaylistInfoInterface} from "./playlist-info-interface";
import {PlaylistFeelsInterface} from "./playlist-feels-interface";

export class PlaylistInfo{
  playlistname: string;
  href: string;
  feels: PlaylistFeelsInterface[];

  constructor( playlistname: string = '', href: string = '', feels: PlaylistFeelsInterface[]) {

    this.playlistname = playlistname;
    this.href = href;
    this.feels = feels;
  }
}
