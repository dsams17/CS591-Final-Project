import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {UserObj as User} from "../classes/user-obj";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {



  constructor(private http: HttpClient) { }
}
