import {PlaylistFeelsInterface} from "./playlist-feels-interface";

export class UserObj {
  public name: string;
  public spotid: string;
  public playlists: PlaylistFeelsInterface[];
  public _id: string;

  constructor({name, spotid, playlists, id}) {

    this.name = name;
    this.spotid = spotid;
    this.playlists = playlists;
    this._id = id;
  }

}
