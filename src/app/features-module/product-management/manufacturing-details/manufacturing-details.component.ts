import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, delay } from 'rxjs';
import { DecimalPipe, NgIf, NgFor } from '@angular/common';
import { ProductService } from '../product-service/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { API_CONSTANTS } from '../../../Constants/api.constant';
import { AlertService } from '../../../services/Toaster/alert.service';

@Component({
  selector: 'app-manufacturing-details',
  templateUrl: './manufacturing-details.component.html',
  styleUrl: './manufacturing-details.component.scss',
  standalone: true,
  providers: [DecimalPipe],
  imports: [ReactiveFormsModule, RouterModule, NgIf, NgFor, MatProgressSpinnerModule]
})
export class ManufacturingDetailsComponent implements OnInit, OnDestroy {
  
  manufactureForm: FormGroup;
  submit = false;
  productId: any;
  productSub: Subscription | undefined;
  productData: any;
  submitted = false;
  // alertService: any;

  constructor(private productService:ProductService, private activatedRoute:ActivatedRoute, private router: Router, private fb: FormBuilder, private alertService: AlertService) {
    this.manufactureForm = this.fb.group({
      manufactureDetail: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      importerDetail: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      packerDetail: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      country: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.productId = params.id;
      this.setProductData();
    });
  }

  setProductData(): void {
    this.productSub = this.productService.productData.pipe(delay(0)).subscribe(data => {
      this.productData = data;
      if (data) {
        this.manufactureForm.patchValue({
          manufactureDetail: this.productData?.product?.manufacturerDetails || null,
          importerDetail: this.productData?.product?.importerDetails || null,
          packerDetail: this.productData?.product?.packerDetails || null,
          country: this.productData?.product?.countryOfOrigin || null
        });
      }
    });
  }

  onInputName(event: any, controlName: string) {
    const inputValue = event.target.value;
    // Additional processing if needed
  }

  save(): void {
    this.submitted = true;
    if (this.manufactureForm.invalid) {
      return;
    }
    this.submit = true;

    const manufactureData = {
      manufacturerDetails: this.manufactureForm.value.manufactureDetail,
      importerDetails: this.manufactureForm.value.importerDetail,
      packerDetails: this.manufactureForm.value.packerDetail,
      countryOfOrigin: this.manufactureForm.value.country,
    };

    this.productService.addManufactureData(this.productId, manufactureData).subscribe(
      (data: any) => {
        if (data) {
          this.submit = false;
          this.submitted = false;
          this.manufactureForm.reset();
          this.alertService.success(data.message);
          
          this.productData.product.manufacturerDetails = data?.data?.manufacturerDetails;
          this.productData.product.importerDetails = data?.data?.importerDetails;
          this.productData.product.packerDetails = data?.data?.packerDetails;
          this.productData.product.countryOfOrigin = data?.data?.countryOfOrigin;


          this.productService.clearProductData(); 
          this.productService.setProductData(this.productData);
          const url = `${API_CONSTANTS.PRODUCT_SEARCH_KEYWORD}/${this.productId}`;
          // this.router.navigate([`${API_CONSTANTS.PRODUCT_SEARCH_KEYWORD}/${this.productId}`]);
          this.router.navigateByUrl(url);

        }
      },
      (err: any) => {
        this.submit = false;
        this.submitted = false;
        this.alertService.warning(err.message);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
  }
}

