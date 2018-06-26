import { Component } from '@angular/core';

import {from} from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
//  template: `<h3>Wooho {{40 + 2}}</h3>`,
//  styleUrls: ['./app.component.css']

})

export class LoginComponent {
  title = 'Login to Spotify';

  login() {
    var promise = new Promise((resolve, reject) => {
      var w = 400,
        h = 500,
        left = (screen.width / 2) - (w / 2),
        top = (screen.height / 2) - (h / 2);

      var authCompleted = false;
      var authWindow = this.openDialog(
        'http://localhost:3000/login',
        'Spotify',
        'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left,
        () => {
          if (!authCompleted) {
            return reject('Login rejected error');
          }
        }
      );

      var storageChanged = (e) => {
        //if (e.key === 'spotify-uname') {
        if (authWindow) {
          authWindow.close();
        }
        //authWindow.document.
        authCompleted = true;

        let authToken = e.newValue;
        window.removeEventListener('keydown', storageChanged, false);

        return resolve(e.newValue);
      };
      //};
      window.addEventListener('keydown', storageChanged, false);


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
