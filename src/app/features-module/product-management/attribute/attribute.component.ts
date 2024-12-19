import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

// Import the Angular Material modules required
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../product-service/product.service';
import { AlertService } from '../../../services/Toaster/alert.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { API_CONSTANTS } from '../../../Constants/api.constant';
import { AddColorComponent } from '../add-color/add-color.component';

// Import your services and components

@Component({
  selector: 'app-attribute',
  standalone: true,
  templateUrl: './attribute.component.html',
  styleUrl: './attribute.component.scss',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterModule, // for navigation
    MatTooltipModule,
    CommonModule,
    // AddAttributeComponent, // your custom component if standalone
    // AttributeValueComponent, // your custom component if standalone
    // AddColorComponent // your custom component if standalone
  ]
})
export class AttributeComponent implements OnInit, OnDestroy {

  // Define component properties
  productId: string = '';
  variantId: string = '';
  colors: any[] = [];
  attributeForm: FormGroup;
  attributesArr: FormArray;
  attributes: any[] = [];
  selectedAttributes: any = [];
  isLoading = false;
  isSubmitting = false;
  submitted: boolean = false;
  productDataSubs: Subscription | undefined;
  productData:any;

  constructor(private productService: ProductService, private alert:AlertService, private activatedRoute: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    // Initialize form
    this.attributeForm = new FormGroup({
      attributes: new FormArray([])
    });
    this.attributesArr = this.attributeForm.controls['attributes'] as FormArray;
  }

  async ngOnInit() {
    this.isLoading = true;
    
    this.activatedRoute.params.subscribe((param: any) => {
      this.productId = param.id;
      this.variantId = param.variantId;
    });

    console.log( this.productId , ' this.productId ', this.variantId ,'this.variantId')
    await this.getProductInfo(this.productId);
    this.getColorsList();
    this.setDataForUpdate();

   
  }

  public getProductInfo(productId: string) {
    console.log(this.productId, 'this.productId >>>');

    return new Promise<void>((resolve) => {
        this.productService.getProductDetails(productId).subscribe((res: any) => {
            this.productData = res.data?.product;
            console.log(this.productData, 'getProductInfo');

            // Ensure dependent function calls happen after data is fetched
            // this.setDataForUpdate();
            this.getAttributeList(this.productData);
            resolve();
        });
    });
}

  private getColorsList(): void {
    this.productService.getColorsList().subscribe((res: any) => {
      // console.log(res, 'getColorsList');
      this.colors = res.data?.color;
    });
  }

  private getAttributeList(productData:any): void {
    console.log(productData?.product?.categoryId, 'this.productData>>>>>1');
    this.productService.getAttributeList(productData?.product?.categoryId).subscribe((res: any) => {

      console.log(res, 'attributes>>>>>>>')
      this.attributes = res.data.attributes.sort((a: any, b: any) => b.useForVariants - a.useForVariants)
      this.isLoading = false;
      this.setAttributes();
    });
  }

  addField(attribute: any, value: string | null = null): void {
    this.attributesArr.push(
      new FormGroup({
        attributeId: new FormControl(attribute._id),
        valueId: new FormControl(value, [Validators.required]),
        isVariant: new FormControl(attribute.useForVariants),
        attributeType: new FormControl(attribute.attributeType)
      })
    );
  }

  setAttributes(): void {
    this.attributes.forEach((attr: any) => {
      let value = null;
      if (this.selectedAttributes && this.selectedAttributes.length) {
        console.log('======',this.selectedAttributes)
        const obj = this.selectedAttributes?.find((e: any) => e.attribute?._id === attr._id);
        value = obj?.value?._id || null;
      }
      this.addField(attr, value);
    });
  }

  setDataForUpdate() {
    this.productDataSubs = this.productService.productData.pipe(delay(0)).subscribe((res: any) => {
      this.productData = res;
    
      this.selectedAttributes = this.productData?.variant?.attributes;
      console.log(this.selectedAttributes, 'setDataForUpdate>>>>');
      this.getAttributeList(this.productData);
    });
  }

  getControlsFromArr(index: number): FormGroup {
    return this.attributesArr.controls[index] as FormGroup;
  }

  submit(): void {
    this.submitted = true;
    const reqData = this.attributeForm.value;

    
    if (this.attributeForm.invalid) {
      this.alert.error('Please choose attributes')
      return;
    }
    this.isSubmitting = true;
    console.log(this.variantId, 'reqData>>>>');

    this.productService.addAttributes(this.productId, reqData, this.variantId).subscribe((res: any) => {
      this.alert.success(res.message);

      this.isSubmitting = false;
      this.submitted = false;
      this.productData.variant = res.data.productVariant;
      this.variantId = res.data.productVariant?._id;
      console.log(this.variantId)
            this.productService.clearProductData();
      this.productService.setProductData(this.productData);

      let url = `${API_CONSTANTS.PRODUCT_IMAGE}/${this.productId}/${this.variantId}`;
      this.router.navigateByUrl(url);

      // this.router.navigate([url]);

      // let url = `${API_CONSTANTS.PRODUCT_IMAGE}/${this.productId}`;
      // this.router.navigate([url]);
    }, err => {
      // this.alert.danger(err.message);
      this.isSubmitting = false;
      this.submitted = false;
    });
  }

  addAttributeValues(attribute: any): void {
    console.log('addAttributeValues>>>>>', attribute)
    if (attribute?.attributeType === 1) {
      console.log('color>>>>')
      this.addColorValue();
    }
    // if (attribute?.attributeType === 3) {
    //   this.addAttributeValue(attribute);
    // }
  }

  private addColorValue(): void {
    const dialogRef = this.dialog.open(AddColorComponent, {
      width: 'auto',
      minWidth: '500px',
      maxWidth: '500px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((color: any) => {
      // console.log(color, 'colorrrrrrrrrrrr')
      if (color) {
        this.colors.unshift(color);
        // this.getAttributeList(this.productData);
      }
    });
  }

  private addAttributeValue(attribute: any): void {
    // const dialogRef = this.dialog.open(AttributeValueComponent, {
    //   data: attribute,
    //   width: 'auto',
    //   minWidth: '300px',
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe((attributeValue: any) => {
    //   if (attributeValue) {
    //     attribute.values.push(attributeValue);
    //   }
    // });
  }

  ngOnDestroy(): void {
    if (this.productDataSubs) {
      this.productDataSubs.unsubscribe();
    }
  }
}

