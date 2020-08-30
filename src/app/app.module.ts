import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HomeComponent } from './home/home.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { StartComponent } from './start/start.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogsComponent } from './dialogs/dialogs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ChattingComponent } from './chatting/chatting.component';

const config = {
  apiKey: "AIzaSyA-ZzXeKJgHwoIKGN3S9RKUE2KJzpIKSvI",
  authDomain: "communityshuix.firebaseapp.com",
  databaseURL: "https://communityshuix.firebaseio.com",
  projectId: "communityshuix",
  storageBucket: "communityshuix.appspot.com",
  messagingSenderId: "795036791428",
  appId: "1:795036791428:web:8369c9be2de17c70f048d1",
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    StartComponent,
    DialogsComponent,
    ChattingComponent
  ],
  entryComponents: [DialogsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
