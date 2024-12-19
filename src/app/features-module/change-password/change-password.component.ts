import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/Toaster/alert.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private _login: LoginService,
    private _route: Router,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      let data = {
        oldPassword: this.changePasswordForm.value.oldPassword,
        password: this.changePasswordForm.value.newPassword
      }

      this._login.changePassword(data).subscribe((res: any) => {
        if (res) {
          this.alertService.success('Password changed successfully');
          this._route.navigate(['/dashboard'])
        }
      }, (error) => {
        this.alertService.error(error.error.message);
      })
    }
  }
}
