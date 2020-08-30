import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogsComponent } from '../dialogs/dialogs.component';
import { NgForm, FormControl, Validators, AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private regexp: RegExp = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  public password: string;

  loginFormGroup = new FormGroup({
    emailFormControl: new FormControl('', [
      Validators.required,
      this.emailValidation
    ]),
    passwordFormControl: new FormControl('', Validators.required)
  });

  registerFormGroup = new FormGroup({
    usernameFormControl: new FormControl('', [Validators.required]),
    photoURLFormControl: new FormControl('https://i.imgur.com/TGuyPBM.png', [Validators.required, this.photoURLValidation]),
    emailFormControl: new FormControl('', [Validators.required, this.emailValidation]),
    passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePasswordFormControl: new FormControl('', [Validators.required, this.rePasswordValidation()])
  });

  constructor(public auth: AuthService, private router: Router, public dialog: MatDialog) {

  }

  ngOnInit(): void {
  }

  rePasswordValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== this.password) {
        return { "rePassword": true };
      }
      return null;
    };
  }

  photoURLValidation(control: AbstractControl): { [key: string]: boolean } | null {
    let fileText = control.value.substr(control.value.length - 4);
    if (fileText != ".png" && fileText != ".gif" && fileText != ".jpg") {
      return { "photoURL": true };
    }
    return null;
  }

  emailValidation(control: AbstractControl): { [key: string]: boolean } | null {
    if (!RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(control.value)) {
      return { 'email': true };
    }
    return null;
  }


  register(): void {
    if (this.registerFormGroup.valid) {
      this.auth.registerWithEmail(
        this.registerFormGroup.get("emailFormControl").value,
        this.registerFormGroup.get("passwordFormControl").value,
        this.registerFormGroup.get("usernameFormControl").value,
        this.registerFormGroup.get("photoURLFormControl").value,
      ).then(
        val => this.router.navigate(['/'])
      ).catch(
        err => this.dialog.open(
        DialogsComponent,
        { data: { title: "Register Failed", content: `There seems to be a problem... Error code: ${err.code}` } }
      ));
    }
  }

  signIn(): void {
    if (this.loginFormGroup.valid) {
      this.auth.signInWithEmail(this.loginFormGroup.get("emailFormControl").value, this.loginFormGroup.get("passwordFormControl").value).then(
        val => this.router.navigate(['/'])
      ).catch(error => {
        switch (error.code) {
          case "auth/wrong-password":
            this.dialog.open(
              DialogsComponent,
              { data: { title: "Password invalid", content: "The typed in password is wrong." } }
            )
            break;
          case "auth/user-not-found":
            this.dialog.open(
              DialogsComponent,
              { data: { title: "User doesn't exist", content: "The typed in E-Mail doesn't exist." } }
            )
            break;
          default:
            this.dialog.open(
              DialogsComponent,
              { data: { title: "Failed Login", content: `There seem to a be a issue with logging in. ${error.message}` } }
            )
            break;
        }
      });
    }
  }
}