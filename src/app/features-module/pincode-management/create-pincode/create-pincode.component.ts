import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ContainerComponent } from '../../../commonComponent/container/container.component';
import { LoginService } from '../../../services/login.service';
import { AlertService } from '../../../services/Toaster/alert.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { MatListModule } from '@angular/material/list';
import { PincodeService } from '../../pincode-management/pincode-service/pincode.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatOption } from '@angular/material/core';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { AddCityComponent } from '../add-city/add-city.component'
import { OrderCancelDialogComponent } from '../../../commonComponent/order-cancel-dialog/order-cancel-dialog.component';

@Component({
  selector: 'app-create-pincode',
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
    MatProgressSpinnerModule,
    MatOption,
    FormsModule, // Add this
    MatCheckboxModule,
    MatSelectModule,
    MatCheckbox
    
  ],
  templateUrl: './create-pincode.component.html',
  styleUrls: ['./create-pincode.component.scss'] // Corrected styleUrl to styleUrls
})
export class CreatePincodeComponent implements OnInit {
  @ViewChild('selectRef') select:any= MatSelect;
  pincodeForm: FormGroup;
  pincodePhotoUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  filteredSuggestions: any[] = []; // Array to hold suggestions  
  isLoading: boolean = false;
  allSelected: boolean = false;
  selectedSuggestions: any[] = [];
  orderService: any;
  alertService: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private pincodeService: PincodeService,
    private toaster: AlertService,
    private dialog: MatDialog,
    private http: HttpClient // Inject HttpClient to make HTTP requests
  ) {
    this.pincodeForm = this.fb.group({
      pincode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{6}$')] // Validate 6-digit pincode
      ],
      country: ['India'],
      state: ['', Validators.required],
      city: ['', Validators.required],
      cities: [[]],
    });
  }

  ngOnInit(): void {
    this.setupPincodeListener(); // Set up listener for pincode changes
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.pincodePhotoUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // onSubmit(): void {
  //   console.log(this.pincodeForm, 'this.pincodeForm')
  //   if (this.pincodeForm.valid) {
  //     const formData = new FormData();
  //     formData.append('pincode', this.pincodeForm.get('pincode')?.value);
  //     formData.append('country', this.pincodeForm.get('country')?.value);
  //     // You can send formData to your service here
  //     console.log('Form Submitted:', this.pincodeForm.value);

  //     if (this.pincodeForm.valid) {
  //       const formData = this.pincodeForm.value;
  //       this.pincodeService.savePincodeData(formData).subscribe(
  //         (response) => {
  //           console.log('Form data saved successfully:', response);
  //           this.pincodeForm.reset()
  //           this.toaster.success('Pincode created successfully');
  //           this.router.navigate([`/pincode-management`]);
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

  onCitiesChange(event: any): void {
    const selectedCities = event.value; // Array of selected cities
    console.log('Selected Cities:', selectedCities);
  
    // Update the cities form control with the selected values
    this.pincodeForm.patchValue({
      cities: selectedCities
    });
  
    console.log('Updated Form:', this.pincodeForm.value);
  }
  

  onSubmit(): void {
    // console.log(this.pincodeForm, 'this.pincodeForm>>>')
    // if (this.pincodeForm.valid) {
      const formData = {
        pincode: this.pincodeForm.get('pincode')?.value,
        country: this.pincodeForm.get('country')?.value,
        state: this.pincodeForm.get('state')?.value,
        // city: this.pincodeForm.get('city')?.value,
        city: this.pincodeForm.get('cities')?.value, // Get the updated cities array
      };

      console.log('Form Data:', formData);

      this.pincodeService.savePincodeData(formData).subscribe(
        (response) => {
          console.log('Form data saved successfully:', response);
          this.pincodeForm.reset();
          this.toaster.success('Pincode created successfully');
          this.router.navigate([`/pincode-management`]);
        },
        (error) => {
          console.error('Error saving form data:', error);
          this.toaster.warning(error.error.message);
        }
      );
    // }
  }

  private setupPincodeListener() {
    
    this.pincodeForm.get('pincode')?.valueChanges.pipe(
      debounceTime(300), // Wait for 300ms pause in events
      switchMap(value => {
        if (value.length === 6) {
          this.isLoading = true; // Show loader only if pincode length is 6
          return this.getPincodeDetails(value); // Trigger API call
        } else {
          // Reset form fields and hide loader if length is not 6
          this.isLoading = false;
          this.clearAddressFields();
          this.filteredSuggestions = [];
          return new Observable(); // Return empty observable to stop further processing
        }
      })
    ).subscribe(details => {
      console.log(details, 'details>>>>');
      this.filteredSuggestions = details;
      this.isLoading = false;
      // if (details && details.PostOffice && details.PostOffice.length > 0) {
      //   this.filteredSuggestions = details.PostOffice; // Set suggestions based on response
      // } else {
      //   this.filteredSuggestions = []; // Clear suggestions if no results
      // }
    });
  }

  private clearAddressFields() {
    // Clear country, state, and city fields
    this.pincodeForm.patchValue({
      country: '',
      state: '',
      city: ''
    });
  }

  // 9990151113 - himanshu, surendra

  // Fetch pincode details from the API
  private getPincodeDetails(pincode: string): Observable<any> {
    if (pincode.length < 6) {
      this.isLoading = false;
      return new Observable(); // Return empty observable if pincode is too short
    }

  // Return an observable that the caller can subscribe to
  return this.pincodeService.getPincodeDetails(pincode).pipe(
    map((res: any) => {
      console.log('pincodeService_res', res); // Log the entire response for debugging
      this.pincodeForm.patchValue({
        state: res?.data[0].State,
        country:res?.data[0].Country
      });
      return res?.data; // Transform the response to emit only the data
    })
  );

  // this.pincodeService.getPincodeDetails(pincode).subscribe((res: any) => {
  //     if (res) {
  //       return res?.data
  //       console.log('pincodeService_res', res);
  //     return  map(response => res?.data)
  //     }
  //   });
  }

  // This function will be called when a suggestion is selected
  onSuggestionSelected(suggestion: any): void {
    this.pincodeForm.patchValue({
      country: suggestion.Country,
      state: suggestion.State,
      city: suggestion.Name // You might want to change this according to your needs
    });

    // console.log(this.pincodeForm, 'this.pincodeForm>>>>>>>')
    
    this.filteredSuggestions = []; // Clear suggestions after selection
  }

  onPincodeChange(pincode: string): void {
    if (pincode && pincode.length === 6) {
      this.pincodeService.getPincodeDetails(pincode).subscribe({
        next: (response: any) => {
          // Assuming your API returns an array of results
          if (response && response.length > 0 && response[0].PostOffice) {
            console?.log(response, 'response>>>>')
            const postOffice = response[0].PostOffice[0]; // Get the first post office
            this.pincodeForm.patchValue({
              country: postOffice.Country,
              state: postOffice.State,
              city: postOffice.District
            });
          }
          
        },
        error: (err) => {
          console.error('Error fetching pincode details:', err);
          // this.toaster.showError('Error fetching pincode details.'); // Adjust according to your alert service
        }
      });
    }
  }

  // toggleAllSelection() {
  //   if (this.allSelected) {
  //     this.select.options.forEach((item: MatOption) => item.select());
  //   } else {
  //     this.select.options.forEach((item: MatOption) => item.deselect());
  //   }
  // }

  onOptionClick(): void {
    const selectedCities = this.pincodeForm.get('cities')?.value || [];
  
    // Check if all individual checkboxes are selected
    this.allSelected = selectedCities.length === this.filteredSuggestions.length;
  }

  toggleAllSelection(): void {
    this.allSelected = !this.allSelected; // Toggle the "Select All" state.
  
    // If "Select All" is true, select all suggestions; otherwise, clear the selection.
    if (this.allSelected) {
      this.pincodeForm.patchValue({
        cities: this.filteredSuggestions.map((suggestion) => suggestion.Name),
      });
    } else {
      this.pincodeForm.patchValue({
        cities: [],
      });
    }
  }


  toggleSuggestion(suggestion: string): void {
    const selectedCities = this.pincodeForm.get('cities')?.value || [];
  
    // Check if the clicked suggestion is already selected.
    const index = selectedCities.indexOf(suggestion);
  
    if (index === -1) {
      // Add the suggestion to the selected list.
      selectedCities.push(suggestion);
    } else {
      // Remove the suggestion from the selected list.
      selectedCities.splice(index, 1);
    }
  
    // Update the cities form control.
    this.pincodeForm.patchValue({ cities: selectedCities });
  
    // Update the "Select All" checkbox state.
    this.allSelected = selectedCities.length === this.filteredSuggestions.length;
  }
  
   optionClick(): void {
    
  const selectedCities = this.pincodeForm.get('cities')?.value || [];

  // Update "Select All" checkbox state based on the length of selected cities
  this.allSelected = selectedCities.length === this.filteredSuggestions.length;
}

addCity(){
  const dialogRef = this.dialog.open(AddCityComponent);
      console.log(dialogRef, 'dialogRef>>>>>>>')
      dialogRef.afterClosed().subscribe(result => {

        console.log(result, 'result>>>>>>>>>>>>>>>>>>>');
        if(result){
          const data = {
            pincode: this.pincodeForm.get('pincode')?.value,
            country: this.pincodeForm.get('country')?.value,
            state: this.pincodeForm.get('state')?.value,
            // city: this.pincodeForm.get('city')?.value,
            city:[result], // Get the updated cities array
          };
    
          console.log('Form Data:', data);
    
          this.pincodeService.savePincodeData(data).subscribe(
            (response) => {
              console.log('Form data saved successfully:', response);
              this.pincodeForm.reset();
              this.toaster.success('Pincode created successfully');
              this.router.navigate([`/pincode-management`]);
            },
            (error) => {
              console.error('Error saving form data:', error);
              this.toaster.warning(error.error.message);
            }
          );
        }
      });
  return false
}

}
