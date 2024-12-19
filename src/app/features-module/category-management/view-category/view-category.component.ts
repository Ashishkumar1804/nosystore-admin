import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { ContainerComponent } from '../../../commonComponent/container/container.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/Toaster/alert.service';
import { CategoryService } from '../category-service/category.service';

@Component({
  selector: 'app-view-category',
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
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.scss'
})
export class ViewCategoryComponent {
  categoryForm: FormGroup;
  selectedParentCategory = '';
  categories: any;
  categoryId: any;
  category: any;
  categoryImageUrl: any; // URL for previewing the current or selected image
  selectedFile: File | null = null; // Store selected file for upload
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toaster: AlertService,
    private http: HttpClient
  ) {
    this.categoryForm = this.fb.group({
      name: [''],
      parentId: [''],
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    // this.getParentCategoryListing();
    this.getCategoryDetail();
  }

  getCategoryDetail() {
    const categoryId = this.categoryId;
    this.categoryService.getCategoryDetails(categoryId).subscribe((data: any) => {
      this.category = data.data;
      this.categoryImageUrl = data.data.image; // Set current image URL for preview
      this.categoryForm.patchValue({
        name: this.category.name,
        parentId: this.category.parentId?._id || '',
      });
    }, () => {
      this.toaster.success('Category list fetched successfully');
    });
  }

  // getParentCategoryListing() {
  //   this.categoryService.getCategoryList(1, 1, "", "all").subscribe((data: any) => {
  //     this.categories = data.data.categories;
  //   }, () => {
  //     this.toaster.success('Category list fetched successfully');
  //   });
  // }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.categoryImageUrl = e.target.result; // Update image preview
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value);
    formData.append('parentId', this.categoryForm.get('parentId')?.value);

    // Append image if a new one is selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.categoryService.updateCategoryById(this.categoryId, formData).subscribe(
      (response) => {
        this.toaster.success('Category updated successfully');
        this.router.navigate([`/category-management`]);
      },
      (error) => {
        this.toaster.error('Failed to update category');
      }
    );
  }
}
