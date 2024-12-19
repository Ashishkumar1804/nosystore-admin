import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AlertService } from '../../services/Toaster/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  providers: [LoginService]
})
export class LoginComponent {
  invalid: boolean = true;
  submitted: boolean = false;
  loginForm!: FormGroup;
  passwordVisible: boolean = false;

  constructor(
    private _login: LoginService,
    private _route: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      email: this.loginForm.value.email,
      name: 'Super Admin',
      password: this.loginForm.value.password
    };

    this._login.login(loginData).subscribe(
      result => {
        
        if (result.status === 200) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', result.data.token);
          this.alertService.success('Login successfully');
          this._route.navigate(['/user']);
        } else {
          this.alertService.warning('Invalid credential.');
          this.invalid = false;
        }
      },
      err => {
        console.log(err, 'result>>>>');
        this.alertService.warning('Invalid credential.');
        console.log(err);
        this.invalid = false;
      }
    );
  }
}
