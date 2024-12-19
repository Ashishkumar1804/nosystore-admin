import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../Module/material.module';
import { PincodeService } from '../pincode-service/pincode.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ContainerComponent } from '../../../commonComponent/container/container.component';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../../services/Toaster/alert.service';
import { debounceTime, switchMap, Observable, map } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-view-pincode',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './view-pincode.component.html',
  styleUrl: './view-pincode.component.scss'
})
export class ViewPincodeComponent {
  isLoading = false;
  pincodeId: string | null = null; 
  // country:String | null =null;
  // state:String | null =null;
  // city:String | null =null;
  // pincode:String | null =null;
  pincodeForm: FormGroup;
  pincodePhotoUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  filteredSuggestions: any= []; // Array to hold suggestions
  loaderService: any;
  constructor( private router: Router,private route: ActivatedRoute, private _pincodeData: PincodeService,  private fb: FormBuilder,
    private pincodeService: PincodeService,
    private toaster: AlertService,
    private http: HttpClient){
    this.pincodeForm = this.fb.group({
      pincode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{6}$')] // Validate 6-digit pincode
      ],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  ngOnInit():void{
    this.pincodeId = this.route.snapshot.paramMap.get('id');

    this.getPincodeById( this.pincodeId);
    this.setupPincodeListener();
  }

  getPincodeById(id:any){   
      this._pincodeData.getPincodeById(id).subscribe((res: any) => {
       console.log(res, 'res>>>>>>>>>');
       this.filteredSuggestions = res?.data[0];
       console.log(this.filteredSuggestions, 'filtered data>>>');
      });
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
        return new Observable(); // Return empty observable if pincode is too short
      }
  
    // Return an observable that the caller can subscribe to
    return this.pincodeService.getPincodeDetails(pincode).pipe(
      map((res: any) => {
        console.log('pincodeService_res', res); // Log the entire response for debugging
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
      this.filteredSuggestions = []; // Clear suggestions after selection
    }
  
    onPincodeChange(pincode: string): void {
      console.log('show-loader');
      if (pincode && pincode.length === 6) {
        
        // this.isLoading = true;
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

              // this.isLoading = false;
            }
          },
          error: (err) => {
            console.error('Error fetching pincode details:', err);
            // this.toaster.showError('Error fetching pincode details.'); // Adjust according to your alert service
          }
        });
      }
    }

    onSubmit(): void {
      console.log(this.pincodeId)
      if (this.pincodeForm.valid) {
       
        const formData = new FormData();
        formData.append('pincode', this.pincodeForm.get('pincode')?.value);
        formData.append('country', this.pincodeForm.get('country')?.value);
        // You can send formData to your service here
        console.log('Form Submitted:', this.pincodeForm.value);
  
        if (this.pincodeForm.valid) {
          const pincodeId:any = this.pincodeId;
          const formData = this.pincodeForm.value;
          this.pincodeService.updatePincodeById(pincodeId, formData).subscribe(
            (response) => {
              console.log('Form data saved successfully:', response);
              // this.pincodeForm.reset()
              this.toaster.success('Pincode updated successfully');
              this.router.navigate(['pincode-management']);
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
    }

}
