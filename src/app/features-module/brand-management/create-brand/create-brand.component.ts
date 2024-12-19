import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AlertService } from '../../../services/Toaster/alert.service';
import { BrandService } from '../brand-service/brand.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { ContainerComponent } from '../../../commonComponent/container/container.component';
import { CategoryService } from '../../category-management/category-service/category.service';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-create-brand',
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
    MatCheckboxModule
  ],
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss'],
})

export class CreateBrandComponent implements OnInit {
  @ViewChild('selectRef') select:any= MatSelect;
  brandForm: FormGroup;
  brandImageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  filteredSuggestions: any[] = []; // Array to hold suggestions  
  selectedParentCategory = '';
  categories:any;
  allSelected=false;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private toaster: AlertService,
    private router: Router,
    private http: HttpClient // Inject HttpClient to make HTTP requests
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      image: [''],
      categoryId:['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getCategoryListing();
  }

  getCategoryListing() {
    this.categoryService.getCategoryList(1,1,"","all").subscribe((data: any) => {

      this.categories = data.data.categories;
      console.log(this.categories, 'data>>>>');
    }, err => {
      // this.$alert.danger(err.message);
      this.toaster.success('category list fetched successfully');
    })
  }
  closeDialog(): void {
    // this.$dialogRef.close(null);
  }

  onSubmit(): void {   
    if (this.brandForm.valid) {
      const formData = new FormData();
      formData.append('name', this.brandForm.value.name)
      // Append each category ID individually, depending on backend expectations
      const categoryIds = this.brandForm.value.categoryId; // Ensure this is an array of category IDs

      // If your backend expects categoryId[] for each value:
      categoryIds.forEach((id: string) => {
        formData.append('categoryId[]', id);  // Option 1: Use 'categoryId[]'
      });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // You can send formData to your service here
      // console.log('Form Submitted:', this.brandForm.value);
        this.brandService.saveData(formData).subscribe(
          (response) => {
            // console.log('Form data saved successfully:', response);
            this.brandForm.reset()
            this.toaster.success('category created successfully');
            this.router.navigate([`/brand-management`]);
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
    this.brandForm.patchValue({
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
      reader.onload = e => this.brandImageUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSelectBrand(event: any) {
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
