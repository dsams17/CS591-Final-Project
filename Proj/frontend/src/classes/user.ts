import {PlaylistFeelsInterface} from "./playlist-feels-interface";

export class User {
  public name: string;
  public spotid: string;
  public playlists: PlaylistFeelsInterface[];

  constructor(name: string = '', spotid: string = '', playlists: PlaylistFeelsInterface[] = []) {

    this.name = name;
    this.spotid = spotid;
    this.playlists = playlists;
  }

}
