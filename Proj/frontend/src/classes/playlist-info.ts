import {PlaylistInfoInterface} from "./playlist-info-interface";
import {PlaylistFeelsInterface} from "./playlist-feels-interface";

export class PlaylistInfo{
  id:number;
  playlistname: string;
  playlistId: string;
  feels: PlaylistFeelsInterface;

  constructor( playlistname: string = '', playlistId: string = "", id: number, feels: PlaylistFeelsInterface ) {

    this.playlistId = playlistId;
    this.playlistname = playlistname;
    this.id = id;
    this.feels = feels;
  }
}
