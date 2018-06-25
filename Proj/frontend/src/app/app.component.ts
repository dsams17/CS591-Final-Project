import { Component } from '@angular/core';

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


export class AppComponent {
  title = 'Login to Spotify';

  login() {
    var promise = new Promise((resolve, reject) => {
      var w = 400,
        h = 500,
        left = (screen.width / 2) - (w / 2),
        top = (screen.height / 2) - (h / 2);

      var params = {
        client_id: "4dd9df623d5145deb5e4387958072cce",
        redirect_uri: "http://127.0.0.1:3000/callback",

        response_type: 'token'
      };
      var authCompleted = false;
      var authWindow = this.openDialog(
        'http://localhost:3000/login' ,
        'Spotify',
        'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left,
        () => {
          if (!authCompleted) {
            return reject('Login rejected error');
          }
        }
      );

      var storageChanged = (e) => {
        if (e.key === 'angular2-spotify-token') {
          if (authWindow) {
            authWindow.close();
          }
          authCompleted = true;

          let authToken = e.newValue;
          window.removeEventListener('storage', storageChanged, false);

          return resolve(e.newValue);
        }
      };
      window.addEventListener('storage', storageChanged, false);
    });

    let observableFromPromise = from(promise);



    return observableFromPromise;
  }


  private openDialog(uri, name, options, cb) {
    var win = window.open(uri, name, options);
    var interval = window.setInterval(() => {
      try {
        if (!win || win.closed) {
          window.clearInterval(interval);
          cb(win);
        }
      } catch (e) { }
    }, 1000000);
    return win;
  }

  private toQueryString(obj: Object): string {
    var parts = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
    };
    return parts.join('&');
  };

  onNavigate(){
    //this.router.navigateByUrl("https://www.google.com");
    window.location.href="http://127.0.0.1:3000/login";
  }
}


