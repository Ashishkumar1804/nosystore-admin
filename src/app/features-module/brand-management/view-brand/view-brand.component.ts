import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { ContainerComponent } from '../../../commonComponent/container/container.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/Toaster/alert.service';
import { CategoryService } from '../../category-management/category-service/category.service';
import { environment } from '../../../../environments/environment';
import { BrandService } from '../brand-service/brand.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-view-brand',
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
  templateUrl: './view-brand.component.html',
  styleUrl: './view-brand.component.scss'
})

export class ViewBrandComponent implements OnInit {
  @ViewChild('selectRef') select:any= MatSelect;
  brandForm: FormGroup;
  brandImageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  filteredSuggestions: any[] = []; // Array to hold suggestions  
  selectedParentCategory = '';
  categories:any;
  allSelected=false;
  brandId: any;
  brand:any;

  constructor(
    private route:ActivatedRoute,
    private fb: FormBuilder,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private toaster: AlertService,
    private router: Router,
    private http: HttpClient // Inject HttpClient to make HTTP requests
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      image: ['',Validators.required],
      categoryId:['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.brandId = this.route.snapshot.paramMap.get('id');
    this.getCategoryListing();
    this.getBrandDetails();
  }

  getBrandDetails() {
    const brandId = this.brandId;
    this.brandService.getDetails(brandId).subscribe((data: any) => {
      this.brand = data.data;
      // console.log(this.brand, 'brand>>')
      this.brandImageUrl = data.data.logo; // Set current image URL for preview

      this.brandForm.patchValue({
        name: this.brand.name,
        categoryId: this.brand.categories
      });
    }, () => {
      this.toaster.success('Brand list fetched successfully');
    });
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
    console.log(this.brandForm.valid, 'onSubmit>>>') 
    // if (this.brandForm.valid) {
      const formData = new FormData();
      // let categoryData:any = Array.from(this.brandForm.value.categoryId)
      // console.log(this.brandForm.value.categoryId,'data..')
      formData.append('name', this.brandForm.value.name)
         // Append each categoryId individually
      // const categoryIds = this.brandForm.value.categoryId; // Assuming this is an array
      // categoryIds.forEach((id: string) => {
      //   formData.append('categoryId', id); // or 'categoryId[]' if your backend expects it
      // });

      // Append each category ID individually, depending on backend expectations
      const categoryIds = this.brandForm.value.categoryId; // Ensure this is an array of category IDs

      // If your backend expects categoryId[] for each value:
      categoryIds.forEach((id: string) => {
        formData.append('categoryId[]', id);  // Option 1: Use 'categoryId[]'
      });

      // If your backend expects repeated 'categoryId' entries for each value:
      // categoryIds.forEach((id: string) => {
      //   formData.append('categoryId', id);  // Option 2: Use repeated 'categoryId'
      // });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // You can send formData to your service here
      // console.log('Form Submitted:', this.brandForm.value);
        this.brandService.update(this.brandId, formData).subscribe(
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
    // }
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
