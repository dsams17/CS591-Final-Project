import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import {UserObj as User} from "../classes/user-obj";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  getUser(uname: string): Observable<any> {
    return this.http.get("http://localhost:3000/users/get/" + uname)
  };

  getPlaylists(uname: string): Observable<any> {
    return this.http.get("http://localhost:3000/getplaylists/" + uname)
  };

  lookupPlaylist(uname: string, playlistId: string): Observable<any>{
    return this.http.get("http://localhost:3000/getmood/"+uname+"/"+playlistId)
  }

  constructor(private http: HttpClient) { }
}
