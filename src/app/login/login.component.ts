import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  loadingLogin = false;
  loadingRegister = false;
  submitted = false;
  logged = true;
  registed = false;
  hide = true;

  constructor(private router: Router,
    private accountService: AccountService,
    private snack: MatSnackBar) {

      if (sessionStorage.getItem('user')) {
        console.log(sessionStorage.getItem('user'));
        this.router.navigate(['/']);
      }

      this.loginForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
      });

      this.registerForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required])
      });
  }

  ngOnInit(): void {
  }

  login() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loadingLogin = true;
    this.accountService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value);
  }

  register() {
    if (this.registerForm.invalid) {
      console.log("REGISTER INVALID");
      return;
    }
    this.loadingRegister = true;
    this.accountService.getByName(this.registerForm.get('username')?.value)
    .subscribe(u => {
      if(!u) {
        console.log("username livre!");
        this.accountService.register(this.registerForm.value).subscribe(resp => console.log(resp));
        this.registerForm.reset();
        this.snack.open("Conta criada com sucesso,\n será rederecionado em 5 segundos", undefined, {duration: 4000,  panelClass: ['green-snackbar']});
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 5000);
      } else {
        console.log("username ocupado!");
        this.registed = true;
      }
    });


  }

}
