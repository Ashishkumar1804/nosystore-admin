import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ColorSketchModule } from 'ngx-color/sketch'; // Example external library for color picker
import { ProductService } from '../product-service/product.service';
import { AlertService } from '../../../services/Toaster/alert.service';

@Component({
  selector: 'app-add-color',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ColorSketchModule, // Replace with your actual color picker module
    MatIcon
  ],
  templateUrl: './add-color.component.html',
  styleUrls: ['./add-color.component.scss'],
})
export class AddColorComponent implements OnInit {
  isSubmitting = false;

  colorForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required, Validators.maxLength(7), Validators.minLength(7)]),
  });

  // Dependency injection using inject() function
  private productService = inject(ProductService);
  private dialogRef = inject(MatDialogRef<AddColorComponent>);
  private alert = inject(AlertService);

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close(null);
  }

  getColor(event: any): void {
    const color = event.color.hex;
    this.colorForm.controls['code'].setValue(color);
  }

  addColor(): void {
    this.isSubmitting = true;
    const reqData = this.colorForm.value;
    this.productService.addColor(reqData).subscribe(
      (res: any) => {
        this.isSubmitting = false;
        const color = res.data.color;
        this.dialogRef.close(color);
        this.alert.success(res.message);
      },
      (err) => {
        this.isSubmitting = false;
        this.alert.warning(err.message);
      }
    );
  }
}
