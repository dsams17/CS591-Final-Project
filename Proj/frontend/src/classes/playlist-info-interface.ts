import {PlaylistFeelsInterface} from "./playlist-feels-interface";

export interface PlaylistInfoInterface{
  playlistname: string;
  id: number;
  feels: PlaylistFeelsInterface;
  playlistId:string;
}
