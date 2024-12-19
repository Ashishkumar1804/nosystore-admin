import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { ContainerComponent } from '../../../commonComponent/container/container.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AlertService } from '../../../services/Toaster/alert.service';
import { CategoryService } from '../../category-management/category-service/category.service';
import { ProductService } from '../product-service/product.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';
import { delay, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-on',
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
    MatCheckboxModule
  ],
  templateUrl: './add-on.component.html',
  styleUrl: './add-on.component.scss'
})

export class AddOnComponent implements OnInit {
  @ViewChild('selectRef') selectForProduct: any = MatSelect; // Reference for Product select
  @ViewChild('selectRef1') selectForWarranty: any = MatSelect; // Reference for Warranty select
  @ViewChild('selectRef2') selectForTechSpec: any = MatSelect; // Reference for TechSpec select

  addOnForm: FormGroup;
  brandImageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  filteredSuggestions: any[] = []; // Array to hold suggestions  
  selectedParentCategory = '';
  categories: any;
  allSelected = false;
  allSelectedForWarranty = false;
  allSelectedForTechSpec = false;
  productId: any;
  warranties: any;
  techSpec: any;
  techSpecs: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toaster: AlertService,
    private router: Router,
    private http: HttpClient // Inject HttpClient to make HTTP requests
  ) {
    this.addOnForm = this.fb.group({
      productId: [null],
      warrantyId: [null],
      techSpecId: [null],
    });
  }

  ngOnInit(): void {

    this.getProductListing();
    this.getWarrantyListing();
    this.getTechSpecListing();

    this.activatedRoute.params.subscribe((params: any) => {
      this.productId = params.id;
      this.setProductData();


    });
  }

  productSub: Subscription | undefined;
  productData: any;


  setProductData(): void {
    this.productSub = this.productService.productData.pipe(delay(0)).subscribe(data => {
      this.productData = data;
      if (data) {

        this.addOnForm.patchValue({
          productId: this.productData?.product?.addonProducts || null,
          warrantyId: this.productData?.variant?.warrantyId || null,
          techSpecId: this.productData?.product?.techSpecs || null,
        });
      }
    });
  }



  getProductListing() {
    this.productService.getProductList().subscribe(
      (data: any) => {
        this.categories = data.data.product;
        this.categories=this.categories.filter((product:any)=>product._id!==this.productId && product.isCompleted===true)
        console.log(this.categories, 'data>>>>');
      },
      (err) => {
        this.toaster.success('Product list fetched successfully');
      }
    );
  }

  getWarrantyListing() {
    this.productService.getWarrantyList().subscribe(
      (data: any) => {
        console.log('data',data)
        this.warranties = data.data.productWarranty;
        console.log(this.warranties, 'data>>>>');
      },
      (err) => {
        this.toaster.success('Warranty list fetched successfully');
      }
    );
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.selectForProduct.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectForProduct.options.forEach((item: MatOption) => item.deselect());
    }
  }

  optionClick() {
    let newStatus = true;
    this.selectForProduct.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  toggleAllSelectionForWarranty() {
    if (this.allSelectedForWarranty) {
      this.selectForWarranty.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectForWarranty.options.forEach((item: MatOption) => item.deselect());
    }
  }

  optionClickForWarranty() {
    let newStatusForWarranty = true;
    this.selectForWarranty.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatusForWarranty = false;
      }
    });
    this.allSelectedForWarranty = newStatusForWarranty;
  }
  variantId:any

  onSubmit(): void {
    console.log(this.addOnForm, 'this.addOnForm>>>>>>>>')
    if (this.addOnForm.valid) {
      const payload = {
        addons: this.addOnForm.value.productId,
        warrantyId: this.addOnForm.value.warrantyId,
        techSpecs: this.addOnForm.value.techSpecId,
      };

      console.log(payload, 'Payload to send>>>');
      let variantID:any=''
      if(payload.warrantyId?.length>0){  variantID=this.productData?.variant?._id}
      console.log()
      this.productService.saveAddOnData(this.productId, payload,variantID).subscribe(
        (response) => {
          this.addOnForm.reset();

          this.toaster.success('Add-on created successfully');
          this.productData.product.addonProducts = response?.data?.product?.addonProducts;
          this.productData.variant.warrantyId = response?.variant?.warrantyId;
          this.productData.product.techSpecs = response?.data?.product?.techSpecs;


          this.productService.clearProductData(); 
          this.productService.setProductData(this.productData);

          const url = `product/create/variant/${this.productId}`;
          this.router.navigateByUrl(url);
          // this.router.navigate([url]);
        },
        (error) => {
          console.error('Error saving form data:', error);
          this.toaster.warning(error.error.message);
        }
      );
    }
  }

  getTechSpecListing(){
    this.productService.getTechSpecList().subscribe(
      (data: any) => {
        this.techSpecs = data.data.techSpecs;
        console.log(this.techSpecs, 'techSpec>>>>');
      },
      (err) => {
        this.toaster.success('Warranty list fetched successfully');
      }
    );
  }

  toggleAllSelectionForTechSpec() {
    if (this.allSelectedForTechSpec) {
      this.selectForTechSpec.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectForTechSpec.options.forEach((item: MatOption) => item.deselect());
    }
  }

  optionClickForTechSpec() {
    let newStatusForTechSpec = true;
    this.selectForTechSpec.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatusForTechSpec = false;
      }
    });
    this.allSelectedForTechSpec = newStatusForTechSpec;
  }
}
