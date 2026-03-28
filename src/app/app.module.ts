import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CountdownComponent } from './deadline/countdown.component';
import { MockDeadlineInterceptor } from './deadline/deadline.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CountdownComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MockDeadlineInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
