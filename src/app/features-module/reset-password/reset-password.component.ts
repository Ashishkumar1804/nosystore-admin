import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/Toaster/alert.service';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  resetPasswordForm!: FormGroup;
  token!: string;
  ngOnInit(): void {
    this.buildForm();

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  buildForm() {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirmPassword: any = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
  }
  passwordVisible: boolean = false;
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  confirmPasswordVisible: boolean = false;
  toggleConfirmVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  get f() {
    return this.resetPasswordForm.controls;
  }
  submitted: boolean = false
  resetPasswordSubmit() {
    this.submitted = true;
    if (this.resetPasswordForm?.invalid) {
      return;
    }

    this.loginService.resetPassword({ password: this.resetPasswordForm.value.newPassword }, this.token).subscribe({
      next: (res: any) => {
        if (res) {
          this.resetPasswordForm.reset();
          this.alertService.success(res.message);
          this.router.navigate(['/'])
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
