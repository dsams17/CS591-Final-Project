import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
//  template: `<h3>Wooho {{40 + 2}}</h3>`,
//  styleUrls: ['./app.component.css']
  styles: [`h2 {
  color: red
  }` ]
})


export class AppComponent {
  title = 'CS591!!!!!';

  onNavigate(){
    //this.router.navigateByUrl("https://www.google.com");
    window.location.href="http://127.0.0.1:3000/login";
  }
}


