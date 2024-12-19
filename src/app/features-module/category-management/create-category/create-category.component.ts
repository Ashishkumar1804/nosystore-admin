import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ContainerComponent } from '../../../commonComponent/container/container.component';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap, Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AlertService } from '../../../services/Toaster/alert.service';
import { CategoryService } from '../category-service/category.service';
import { MatSelectModule } from '@angular/material/select';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ContainerComponent,
    MatListModule,
    MatSelectModule
  ],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss'
})
// export class CreateCategoryComponent {

// }

export class CreateCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categoryImageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  filteredSuggestions: any[] = []; // Array to hold suggestions  
  selectedParentCategory = '';
  categories:any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toaster: AlertService,
    private http: HttpClient // Inject HttpClient to make HTTP requests
  ) {
    this.categoryForm = this.fb.group({
      name: ['',Validators.required],
      image: ['', Validators.required],
      // parentId:['']
    });
  }

  ngOnInit(): void {
    // this.getParentCategoryListing();
  }

  // getParentCategoryListing() {
  //   this.categoryService.getCategoryList(1,1,"","all").subscribe((data: any) => {

  //     this.categories = data.data.categories;
  //     // console.log(this.categories, 'data>>>>');
  //   }, err => {
  //     // this.$alert.danger(err.message);
  //     this.toaster.success('category list fetched successfully');
  //   })
  // }
  closeDialog(): void {
    // this.$dialogRef.close(null);
  }

  onSubmit(): void {   
    console.log('fcghjbklm', this.categoryForm.valid, this.categoryForm);
    // if (this.categoryForm.valid) {
      const formData = new FormData();
      formData.append('name', this.categoryForm.value.name)
      // Append each category ID individually, depending on backend expectations
      const categoryIds = this.categoryForm.value.categoryId; // Ensure this is an array of category IDs

      // // If your backend expects categoryId[] for each value:
      // categoryIds.forEach((id: string) => {
      //   formData.append('categoryId[]', id);  // Option 1: Use 'categoryId[]'
      // });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // You can send formData to your service here
      // console.log('Form Submitted:', this.categoryForm.value);
        this.categoryService.saveData(formData).subscribe(
          (response) => {
            // console.log('Form data saved successfully:', response);
            this.categoryForm.reset()
            this.toaster.success('category created successfully');
            this.router.navigate([`/category-management`]);
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

  // onSubmit(): void {
  //   if (this.categoryForm.valid) {
  //     const formData = new FormData();

  //     console.log(this.selectedFile, 'selected file>>>>');

  //     if (this.selectedFile) {
  //       formData.append('image', this.selectedFile);
  //     }

  //     console.log('formData>>>>', formData)
     
  //     // You can send formData to your service here
  //     console.log('Form Submitted:', this.categoryForm.value);

  //     if (this.categoryForm.valid) {
  //       const formData = this.categoryForm.value;
  //       this.categoryService.saveData(formData).subscribe(
  //         (response) => {
  //           console.log('Form data saved successfully:', response);
  //           this.categoryForm.reset()
  //           this.toaster.success('category created successfully');
  //           // Optionally, display a success message or clear the form
  //         },
  //         (error) => {
  //           console.error('Error saving form data:', error);
  //           this.toaster.warning(error.error.message)
  //           // Handle the error, e.g., show an error message
  //         }
  //       );
  //     }
  //   }
  // }

  // This function will be called when a suggestion is selected
  onSuggestionSelected(suggestion: any): void {
    this.categoryForm.patchValue({
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
      reader.onload = e => this.categoryImageUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSelectCategory(event: any) {
    this.selectedParentCategory = event.target.value;
    console.log(this.selectedParentCategory);
  }
}
