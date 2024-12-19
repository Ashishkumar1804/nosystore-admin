import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ContainerComponent } from '../../../commonComponent/container/container.component';
import { MatListModule } from '@angular/material/list';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { environment } from '../../../../environments/environment';
import { TechSpecsService } from '../service/tech-specs.service';
import { AlertService } from '../../../services/Toaster/alert.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-create-tech-specs',
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
  templateUrl: './create-tech-specs.component.html',
  styleUrl: './create-tech-specs.component.scss'
})
export class CreateTechSpecsComponent {

  @ViewChild('selectRef') select:any= MatSelect;
  techSpecsForm: FormGroup;
  techSpecsImageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  filteredSuggestions: any[] = []; // Array to hold suggestions  
  selectedParentCategory = '';
  categories:any;
  allSelected=false;

  constructor(
    private fb: FormBuilder,
    private techSpecsService: TechSpecsService ,
    private toaster: AlertService,
    private router: Router,
    private http: HttpClient // Inject HttpClient to make HTTP requests
  ) {
    this.techSpecsForm = this.fb.group({
      name: ['', Validators.required],
      image: ['',Validators.required],
      description:['']
    });
  }

  ngOnInit(): void {
    // this.getCategoryListing();
  }


  closeDialog(): void {
    // this.$dialogRef.close(null);
  }

  onSubmit(): void {   
    if (this.techSpecsForm.valid) {
      const formData = new FormData();
      formData.append('title', this.techSpecsForm.value.name)
      formData.append('description', this.techSpecsForm.value.description)



      // If your backend expects categoryId[] for each value:

      if (this.selectedFile) {
        formData.append('logo', this.selectedFile);
      }

      // You can send formData to your service here
      // console.log('Form Submitted:', this.techSpecsForm.value);
        this.techSpecsService.saveData(formData).subscribe(
          (response) => {
            // console.log('Form data saved successfully:', response);
            this.techSpecsForm.reset()
            this.toaster.success('techSpec created successfully');
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

  // This function will be called when a suggestion is selected
  onSuggestionSelected(suggestion: any): void {
    this.techSpecsForm.patchValue({
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
      reader.onload = e => this.techSpecsImageUrl = reader.result;
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
