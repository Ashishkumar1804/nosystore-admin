import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../../services/login.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AlertService } from '../../services/Toaster/alert.service';
import { MatIconModule } from '@angular/material/icon';
import { ContainerComponent } from '../../commonComponent/container/container.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ContainerComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  profilePhotoUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl

  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private toaster: AlertService,
    private container: ContainerComponent) {
    this.profileForm = this.fb.group({
      name: [''],
      address: [''],
      profilePic: ['']
    });
  }

  ngOnInit(): void {
    this.fetchAdminDetails();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.profilePhotoUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = new FormData();
      formData.append('name', this.profileForm.get('name')?.value);
      formData.append('address', this.profileForm.get('address')?.value);
      if (this.selectedFile) {
        formData.append('profilePic', this.selectedFile);
      }
      if (!this.selectedFile) {
        formData.append('profilePic', "");
      }
      this.loginService.editAdminProfile(formData).subscribe((res: any) => {
        if (res) {
          this.toaster.success('Profile updated successfully');
          this.fetchAdminDetails();
          this.container.ngOnInit();
        }
      }, (err) => {
        this.toaster.warning(err.message)
      })

    }
  }

  profileDetails: any
  fetchAdminDetails() {
    this.loginService.getAdminDetails().subscribe((res: any) => {
      if (res) {
        this.profileDetails = res.data;
        this.profilePhotoUrl = this.imageUrl + this.profileDetails.profilePic;
        this.profileForm.patchValue({
          name: this.profileDetails.name,
          address: this.profileDetails.address,
          profilePic: `${this.imageUrl}${this.profileDetails.profilePic}`
        })
      }
    }, (error) => {
      this.toaster.warning(error)
    })
  }
}
