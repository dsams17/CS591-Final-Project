import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { UserApiService } from "../services/user-api-service";

import { AppComponent } from "../components/app/app.component";
import { UserFormComponent } from '../components/app/user-form/user-form.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {path: "user/:id", component: UserFormComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,


  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
  ],
  providers: [UserApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
