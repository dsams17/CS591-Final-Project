import { Component, OnInit } from '@angular/core';
import { UserApiService } from "../../services/user-api-service";


import {from} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
//  template: `<h3>Wooho {{40 + 2}}</h3>`,
//  styleUrls: ['./app.component.css']
  styles: [`h2 {
  color: red
  }` ]
})


export class AppComponent implements OnInit{
  ngOnInit(): void {
    document.body.classList.add('bg-img');
  }
  loggedin = false;
  title = 'Welcome to the playlist mood analyzer. Please login to continue';

  isLoggedIn(){
    return window.sessionStorage.getItem("loggedin") !== null;
  }

  onNavigate(){
    window.location.href="http://127.0.0.1:3000/login";
    window.sessionStorage.setItem("loggedin","yes");
    //let spotuser = url.searchParams.get("uname")
  }

  constructor(private user: UserApiService){}
}


