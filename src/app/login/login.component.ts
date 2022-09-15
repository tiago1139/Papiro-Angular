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

  async login() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loadingLogin = true;
    this.loginForm.disable();
    
    let l = await this.accountService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value);

    if(typeof l === 'boolean') {
      if(!l) {
        setTimeout(() => {
          this.loadingLogin = false;
          this.loginForm.enable();
          this.snack.open("Username ou Password incorretos ! :C", undefined, {duration: 4000,  panelClass: ['red-snackbar']});

        }, 2000);
      }
    } else {
        setTimeout(() => {
          this.loadingLogin = false;
          this.loginForm.enable();
          this.snack.open("Username ou Password incorretos ! :C", undefined,
           {duration: 4000,
            panelClass: ['red-snackbar']
          });

        }, 2000);
    }
    
  }

  register() {
    if (this.registerForm.invalid) {
      console.log("REGISTER INVALID");
      return;
    }
    this.loadingRegister = true;
    this.registerForm.disable();

    this.accountService.getByName(this.registerForm.get('username')?.value)
    .subscribe(u => {
      if(!u) {
        console.log("username livre!");
        this.accountService.register(this.registerForm.value).subscribe(resp => {
          console.log(resp);
          this.snack.open("Conta criada com sucesso,\n será rederecionado em 5 segundos", undefined, {duration: 4000,  panelClass: ['green-snackbar']});
          setTimeout(() => {
            this.accountService.login(this.registerForm.get('username')?.value, this.registerForm.get('password')?.value);
          }, 5000);
        });
      } else {
        setTimeout(() => {
          console.log("username ocupado!");
          this.registed = true;
          this.loadingRegister = false;
          this.registerForm.enable();
          this.snack.open("O Username escolhido já existe ! :C", undefined,
           {duration: 4000,
            panelClass: ['red-snackbar']
          });

        }, 2000);
      }
    });


  }

}
