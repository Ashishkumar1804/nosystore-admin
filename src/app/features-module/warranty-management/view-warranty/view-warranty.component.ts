import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { ContainerComponent } from '../../../commonComponent/container/container.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AlertService } from '../../../services/Toaster/alert.service';
import { QuillModule } from 'ngx-quill';
import { WarrantyService } from '../warranty-service/warranty.service';

@Component({
  selector: 'app-view-warranty',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ContainerComponent,
    MatListModule,
    MatSelectModule,
    MatCheckboxModule,
    QuillModule
  ],
  templateUrl: './view-warranty.component.html',
  styleUrl: './view-warranty.component.scss'
})

export class ViewWarrantyComponent implements OnInit {
  @ViewChild('selectRef') select:any= MatSelect;
  warrantyForm: FormGroup;
  warrantyImageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  filteredSuggestions: any[] = []; // Array to hold suggestions  
  selectedParentCategory = '';
  categories:any;
  allSelected=false;
  warrantyId: any;
  warranty:any;

  constructor(
    private route:ActivatedRoute,
    private fb: FormBuilder,
    private warrantyService: WarrantyService,
    private toaster: AlertService,
    private router: Router,
    private http: HttpClient // Inject HttpClient to make HTTP requests
  ) {
    this.warrantyForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      year: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.warrantyId = this.route.snapshot.paramMap.get('id');
    this.getDetails();
  }

  getDetails() {
    const warrantyId = this.warrantyId;
    this.warrantyService.getDetails(warrantyId).subscribe((data: any) => {
      this.warranty = data.data;

      this.warrantyForm.patchValue({
        name: this.warranty.name,
        price: this.warranty.price,
        year: this.warranty.year,
        description: this.warranty.description
      });
    }, () => {
      this.toaster.success('Warranty fetched successfully');
    });
  }

  
  closeDialog(): void {
    // this.$dialogRef.close(null);
  }

  onSubmit(): void {  
    if (this.warrantyForm.valid) {

      const formData = this.warrantyForm.value;
      
        this.warrantyService.update(this.warrantyId, formData).subscribe(
          (response) => {
            // console.log('Form data saved successfully:', response);
            this.warrantyForm.reset()
            this.toaster.success('warranty updated successfully');
            this.router.navigate([`/warranty-management`]);
            // Optionally, display a success message or clear the form
          },
          (error) => {
            console.error('Error saving form data:', error);
            this.toaster.warning(error.error.message)
            // Handle the error, e.g., show an error message
          }
        );
    }
  }

  // This function will be called when a suggestion is selected
  onSuggestionSelected(suggestion: any): void {
    this.warrantyForm.patchValue({
      country: suggestion.Country,
      state: suggestion.State,
      city: suggestion.Name // You might want to change this according to your needs
    });
    this.filteredSuggestions = []; // Clear suggestions after selection
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.warrantyImageUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSelectwarranty(event: any) {
    this.selectedParentCategory = event.target.value;
    console.log(this.selectedParentCategory);
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

   optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
}
