import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { AppShellModule } from '@angular/app-shell';

import { AppComponent } from './app.component';
import { UserListComponent } from './user/user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppShellModule.runtime()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
