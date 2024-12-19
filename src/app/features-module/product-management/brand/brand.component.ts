import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSortModule, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { delay, Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertService } from '../../../services/Toaster/alert.service';
import { BrandService } from '../../brand-management/brand-service/brand.service';
import { ProductService } from '../product-service/product.service';
import { QuillModule } from 'ngx-quill';
import { AddBrandComponent } from '../add-brand/add-brand.component';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSortModule,
    RouterModule,
    MatProgressSpinnerModule,
    QuillModule
  ],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit, OnDestroy {
  sort = '-createdAt';
  page = 1;
  limit = 500;
  brandForm: FormGroup;
  brandData: any[] = [];
  productData: any;
  productId = '';
  productDataSubs: Subscription | undefined;
  isLoading = false;
  isPageLoading = false;
  selectedBrand = '';
  categoryId = '';
  sortDir = 'desc';
  submitted = false;

  // Configuration for the Quill Editor
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ font: [] }],
      [{ align: [] }],
      ['link'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private brandService: BrandService,
    private alert: AlertService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.brandForm = this.fb.group({
      description: ['', Validators.required],
      name: ['', Validators.required],
      brand: ['', Validators.required],
      inTheBox: ['', Validators.required],
      // tech: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    let productData:any = localStorage.getItem('productData');
    productData = JSON.parse(productData);   

    this.productData = productData;
    this.categoryId = this.productData?.product?.categoryId;
    this.productId = this.productData?.product?._id;
    this.selectedBrand = this.productData?.product?.brandId;
    
// console.log(productData, 'productData>>>');
    this.isPageLoading = true;
    this.activatedRoute.params.subscribe((params: any) => {
      this.productId = params.id;
    });
    this.setProductDataForUpdate();
    console.log(2);
    this.getBrand();
  }

  private setProductDataForUpdate(): void {


    this.productDataSubs = this.productService.productData
      .pipe(delay(0))
      .subscribe((data: any) => {
        console.log('===========================',data)
        this.productData = data;
        this.categoryId = this.productData?.product?.categoryId;
        this.selectedBrand = this.productData?.product?.brandId;
        this.patchForm();
        if (this.categoryId) {
          console.log(1);
          setTimeout(() => {
            this.getBrand();
          }, 100);
        }
      });
  }

  private patchForm() {
    // console.log('====',this.productData?.product?.description)
    this.brandForm.patchValue({
      description: this.productData?.product?.description,
      brand: this.productData?.product?.brandId,
      name: this.productData?.product?.name,
      inTheBox: this.productData?.product?.inTheBox,
    });
    setTimeout(() => {
      this.brandForm.controls['brand'].setValue(this.selectedBrand);
    }, 10);
  }

  onInputName(event: any, controlName: string) {
    const inputValue = event.target.value;
    if (!inputValue.trim()) {
      this.brandForm.patchValue({ [controlName]: '' });
    }
  }

  getBrand() {
    this.productService.brandList(this.categoryId).subscribe(
      (data: any) => {
        this.brandData = data?.data;
        
        this.isPageLoading = false;
      },
      (err: any) => {
        // this.alert.danger(err.message);
        this.isPageLoading = false;
      }
    );
  }

  addBrand(): void {
    console.log(this.productData, 'addBrand>>>')
    const dialogRef = this.dialog.open(AddBrandComponent, {
      data: this.productData.product.categoryId,
      width: 'auto',
      minWidth: '300px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.brandData.unshift(res);
      }
    });
  }

  save() {
    this.submitted = true;
    console.log(this.brandForm.value)
    if (this.brandForm.invalid) {
      return;
    }
    this.isLoading = true;
    const brandData = {
      name: this.brandForm.value.name,
      description: this.brandForm.value.description,
      brandId: this.brandForm.value.brand,
      inTheBox: this.brandForm.value.inTheBox,
    };
    this.productService.generalInfo(this.productId, brandData).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data) {
          this.submitted = false;
          this.alert.success(data.message);
          this.productData.product.brandId = data.data.brandId;
          this.productData.product.description = data.data.description;
          this.productData.product.name = data.data.name;
          this.productData.product.inTheBox = data.data.inTheBox;

          this.productService.clearProductData();
          this.productService.setProductData(this.productData);

          console.log('this.productData?.variant',this.productData)
          let url = `${API_CONSTANTS.PRODUCT_ATTRIBUTE}/${this.productId}`;
          // let url = `${PRODUCT_ATTRIBUTES_ROUTE.url}/${this.productId}`;
          if (this.productData?.variant?._id) url = `${url}/${this.productData?.variant?._id}`;

  

          console.log(url, 'url>>>>');
          this.router.navigateByUrl(url);


          // this.router.navigate([url]);
          // if (this.productData?.variant?._id) {
          //   url = `{url}/{this.productData?.variant?._id}`;
          // }
          // this.router.navigateByUrl(url);
        }
      },
      (err: any) => {
        this.isLoading = false;
        // this.alert.danger(err.message);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.productDataSubs) {
      this.productDataSubs.unsubscribe();
    }
  }

  sortChange(sort: Sort) {
    const sortBy = sort.active;
    if (sort.direction === 'asc') {
      this.sort = sortBy;
      this.sortDir = 'asc';
    } else if (sort.direction === 'desc') {
      this.sort = `-{sortBy}`;
      this.sortDir = 'desc';
    } else {
      return;
    }
    this.getBrand();
  }
}

