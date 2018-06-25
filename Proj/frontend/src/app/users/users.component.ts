import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any;
  constructor(private http: HttpClient ) {
    http.get('http://localhost:3000/api/db')
      .subscribe(
        data => this.users = data,
        err => console.log(`Error: ${err}`),
        () => console.log(`Completed request`)
      );
  }

  ngOnInit() {
  }

}
