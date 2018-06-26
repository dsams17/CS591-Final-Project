import {PlaylistInfoInterface} from "./playlist-info-interface";

export class User {
  public name: string;
  public spotid: string;
  public playlists: PlaylistInfoInterface[];

  constructor(name: string = '', spotid: string = '', playlists: PlaylistInfoInterface[] = []) {

    this.name = name;
    this.spotid = spotid;
    this.playlists = playlists;
  }

}
