import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from "../components/app/app.component";
import { UserFormComponent } from '../components/app/user-form/user-form.component';


@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,


  ],
  imports: [

    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
