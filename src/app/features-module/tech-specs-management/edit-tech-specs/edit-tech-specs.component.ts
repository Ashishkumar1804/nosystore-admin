import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { TechSpecsService } from '../service/tech-specs.service';
import { AlertService } from '../../../services/Toaster/alert.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContainerComponent } from '../../../commonComponent/container/container.component';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-edit-tech-specs',
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
  templateUrl: './edit-tech-specs.component.html',
  styleUrl: './edit-tech-specs.component.scss'
})
export class EditTechSpecsComponent {

  @ViewChild('selectRef') select:any= MatSelect;
  techSpecsForm: FormGroup;
  techSpecImageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  filteredSuggestions: any[] = []; // Array to hold suggestions  
  selectedParentCategory = '';
  categories:any;
  allSelected=false;
  techSpecId: any;
  techSpec:any;

  constructor(
    private route:ActivatedRoute,
    private fb: FormBuilder,
    private techSpecsService: TechSpecsService,
    private toaster: AlertService,
    private router: Router,
    private http: HttpClient // Inject HttpClient to make HTTP requests
  ) {
    this.techSpecsForm = this.fb.group({
      name: ['', Validators.required],
      image: [''],
      description:['']

    });
  }

  ngOnInit(): void {
    this.techSpecId = this.route.snapshot.paramMap.get('id');
    this.getBrandDetails();
  }

  getBrandDetails() {
    const techSpecId = this.techSpecId;
    this.techSpecsService.getDetails(techSpecId).subscribe((data: any) => {
      this.techSpec = data.data;
      // console.log(this.brand, 'brand>>')
      this.techSpecImageUrl = data.data.logo; // Set current image URL for preview

      this.techSpecsForm.patchValue({
        name: this.techSpec.title,
        description:this.techSpec.description,
      });
    }, () => {
      this.toaster.success('TechSpec list fetched successfully');
    });
  }

  closeDialog(): void {
    // this.$dialogRef.close(null);
  }

  onSubmit(): void {   
    console.log(this.techSpecsForm.valid)
    console.log(this.techSpecsForm.value)

    if (this.techSpecsForm.valid) {
      const formData = new FormData();

      formData.append('title', this.techSpecsForm.value.name)


      // If your backend expects categoryId[] for each value:
      formData.append('description', this.techSpecsForm.value.description)


      // If your backend expects repeated 'categoryId' entries for each value:
      // categoryIds.forEach((id: string) => {
      //   formData.append('categoryId', id);  // Option 2: Use repeated 'categoryId'
      // });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // You can send formData to your service here
      // console.log('Form Submitted:', this.techSpecsForm.value);
        this.techSpecsService.update(this.techSpecId, formData).subscribe(
          (response) => {
            // console.log('Form data saved successfully:', response);
            this.techSpecsForm.reset()
            this.toaster.success('Tech Spec created successfully');
            this.router.navigate([`/tech-specs`]);
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



  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.techSpecImageUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }




}
