import {PlaylistFeelsInterface} from "./playlist-feels-interface";

export interface PlaylistInfoInterface{
  playlistname: string;
  href: string;
  feels: PlaylistFeelsInterface[];
}
