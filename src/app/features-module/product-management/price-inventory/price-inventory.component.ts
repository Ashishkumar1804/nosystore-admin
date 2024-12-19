import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, delay } from 'rxjs';
import { DecimalPipe, NgIf, NgFor } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { ProductService } from '../product-service/product.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';
import { AlertService } from '../../../services/Toaster/alert.service';
@Component({
  selector: 'app-price-inventory',
   templateUrl: './price-inventory.component.html',
  styleUrl: './price-inventory.component.scss',
  standalone: true,
  providers: [DecimalPipe],
  imports: [ReactiveFormsModule, RouterModule, NgIf, NgFor, MatProgressSpinnerModule]
})
export class PriceInventoryComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private alertService:AlertService, private router: Router,private activatedRoute: ActivatedRoute, private productService: ProductService, private dataService: DataService,
   ) { }
  private decimalPipe = inject(DecimalPipe);

  productData: any;
  productId: string = '';
  variantId: string = '';
  isSubmitting = false;
  productDataSubscription: Subscription | undefined;
  valueChangeSubscription: Subscription | undefined;

  priceForm: FormGroup = new FormGroup({
    regularPrice: new FormControl('', [Validators.required, Validators.min(1)]),
    salePrice: new FormControl(0, [Validators.min(0)]),
    sku: new FormControl('', [Validators.required]),
    stockQuantity: new FormControl('', [Validators.required, Validators.min(1)]),
    soldIndividualStock: new FormControl(''),
    lowThresholdStock: new FormControl('', [Validators.required, Validators.min(1)])
  });

  submitted: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.productId = params.id;
      this.variantId = params.variantId;
    });

    console.log(this.variantId ,this.productId, 'this.variantId >>>>');
    this.setDataForUpdate();
  }

  ngAfterViewInit(): void {
  const salePriceControl = this.priceForm.controls['salePrice'];
  const regularPriceControl = this.priceForm.controls['regularPrice'];

  // Update validators for regularPrice based on salePrice
  salePriceControl.valueChanges.subscribe((salePrice: string) => {
    if (salePrice) {
      regularPriceControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.min(Number(salePrice)),
      ]);
    } else {
      regularPriceControl.setValidators([
        Validators.required,
        Validators.min(1),
      ]);
    }
    regularPriceControl.updateValueAndValidity({ emitEvent: false });
  });

  // Update validators for salePrice based on regularPrice
  regularPriceControl.valueChanges.subscribe((regularPrice: string) => {
    if (regularPrice) {
      salePriceControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(Number(regularPrice)),
      ]);
    } else {
      salePriceControl.setValidators([
        Validators.required,
        Validators.min(1),
      ]);
    }
    salePriceControl.updateValueAndValidity({ emitEvent: false });
  });
}

  
  preventFraction(formControlName: string): void {
    const value = this.priceForm.controls[formControlName].value;
    if (Number(value) - Math.floor(value) !== 0) {
      this.priceForm.controls[formControlName].setErrors({ fractionNotAllowed: true });
    }
  }

  twoFraction(formControlName: string): void {
    let value = this.priceForm.controls[formControlName].value;
    if (value) {
      value = this.decimalPipe.transform(value, '1.2-2') || value;
      this.priceForm.controls[formControlName].setValue(value);
    }
  }

  setDataForUpdate(): void {
    this.productDataSubscription = this.productService.productData
      .pipe(delay(0))
      .subscribe((data: any) => {
        this.productData = data;
        const {
          regularPrice,
          salePrice,
          sku,
          stockQuantity,
          soldIndividualStock,
          lowThresholdStock,
        } = this.productData?.variant;

        console.log('12345678',this.productData?.variant)
        this.priceForm.patchValue({
          regularPrice: regularPrice || null,
          salePrice: salePrice || null,
          sku: sku || null,
          stockQuantity: stockQuantity || null,
          soldIndividualStock: soldIndividualStock || null,
          lowThresholdStock: lowThresholdStock || null,
        });
      });
  }

  formControl(formControlName: string): { touched?: boolean; errors?: any } {
    return {
      touched: this.priceForm.controls[formControlName].touched,
      errors: this.priceForm.controls[formControlName].errors,
    };
  }

  submit(): void {
    // console.log(`${API_CONSTANTS.PRODUCT_MAUFACTURING_DETAIL}/${this.productId}`, 'PRODUCT_MAUFACTURING_DETAIL>>>>>>>>>');
    this.submitted = true;
    if (this.priceForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    const reqData = this.priceForm.value;
    if (!reqData.salePrice) reqData.salePrice = reqData.regularPrice;

    this.productService.addPriceAndInventory(this.productId, this.variantId, reqData).subscribe(
      (res: any) => {
        console.log(res, "addPriceAndInventory>>>>>")
        this.isSubmitting = false;
        this.alertService.success(res.message);
        
        // const updatedVariant = res.data.productVariant;
        // Object.assign(this.productData.variant, {
        //   salePrice: updatedVariant.salePrice,
        //   regularPrice: updatedVariant.regularPrice,
        //   sku: updatedVariant.sku,
        //   stockQuantity: updatedVariant.stockQuantity,
        //   soldIndividualStock: updatedVariant.soldIndividualStock,
        //   lowThresholdStock: updatedVariant.lowThresholdStock,
        // });
        this.productData.variant.salePrice = res.data.productVariant.salePrice;
        this.productData.variant.regularPrice = res.data.productVariant.regularPrice;
        this.productData.variant.sku = res.data.productVariant.sku;
        this.productData.variant.stockQuantity = res.data.productVariant.stockQuantity;
        this.productData.variant.soldIndividualStock = res.data.productVariant.soldIndividualStock;
        this.productData.variant.lowThresholdStock = res.data.productVariant.lowThresholdStock;
  
        this.productService.clearProductData();
        this.productService.setProductData(this.productData);
        
        // this.router.navigate([`${API_CONSTANTS.PRODUCT_MAUFACTURING_DETAIL}/${this.productId}`]);
        const url = `${API_CONSTANTS.PRODUCT_MAUFACTURING_DETAIL}/${this.productId}`
        this.router.navigateByUrl(url);

      },
      (err) => {
        this.isSubmitting = false;
        this.alertService.warning(err.message);
      }
    );
  }

  ngOnDestroy(): void {
    this.productDataSubscription?.unsubscribe();
    this.valueChangeSubscription?.unsubscribe();
  }
}

