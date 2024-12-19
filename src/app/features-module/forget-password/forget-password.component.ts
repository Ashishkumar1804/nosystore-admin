import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/Toaster/alert.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    private loginService: LoginService,
    private router: Router) { }

  forgetPasswordForm!: FormGroup
  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgetPasswordForm.controls;
  }
  submitted: boolean = false
  forgetPasswordSubmit() {
    this.submitted = true;
    if (this.forgetPasswordForm?.invalid) {
      return;
    }
    this.loginService.forgetPassword({ email: this.forgetPasswordForm.value.email }).subscribe({
      next: (res: any) => {
        if (res) {
          this.forgetPasswordForm.reset();
          this.alertService.success(res.message);
          this.router.navigate(['/login'])
        }
      },
      error: (error) => {
        this.alertService.error(error.error.message);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }
}
