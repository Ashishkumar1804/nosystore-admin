import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, delay } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';
import { ProductService } from '../product-service/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertService } from '../../../services/Toaster/alert.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Component({
  selector: 'app-search-keyword',
  standalone: true,
  templateUrl: './search-keyword.component.html',
  styleUrl: './search-keyword.component.scss',
  imports: [ReactiveFormsModule, RouterModule, NgIf, NgFor, MatProgressSpinnerModule],
})
export class SearchKeywordComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  productId: any;
  productSub: Subscription | undefined;
  productData: any;
  isLoading = false;

  constructor( private alertService: AlertService ,private router: Router,private activatedRoute: ActivatedRoute, private productService: ProductService, private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchKeywords: this.fb.array([new FormControl('')]),
      videoUrl: ['']
    });
  }

  get searchKeywordArr(): FormArray {
    return this.searchForm.controls['searchKeywords'] as FormArray;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.productId = params.id;
    });
    this.setProductData();
  }

  setProductData(): void {
    this.productSub = this.productService.productData.pipe(delay(0)).subscribe(data => {
      this.productData = data;
      if (this.productData?.product?.searchKeywords?.length) {
        this.searchKeywordArr.clear();
        this.productData.product.searchKeywords.forEach((element: any) => {
          this.addField(element);
        });
      }
      this.searchForm.patchValue({
        videoUrl: data?.product?.videoUrl || ''
      });
    });
  }

  addField(value: any = ''): void {
    this.searchKeywordArr.push(new FormControl(value));
  }

  save(): void {
    if (this.searchForm.invalid) return;
    this.isLoading = true;

    const searchKeywords = this.searchForm.value.searchKeywords.filter((e: any) => e?.trim() !== '');
    const videoUrl = this.searchForm.value.videoUrl;
    const searchData: any = {};

    if (videoUrl) {
      searchData.videoUrl = videoUrl;
    }
    if (searchKeywords.length) {
      searchData.searchKeywords = searchKeywords;
    }

    this.productService.addSearchKeywords(searchData, this.productId).subscribe(
      (res) => {
        this.isLoading = false;
        this.alertService.success(res.message);
        this.searchForm.reset();
        // this.productData.product.videoUrl = res?.data?.product?.videoUrl;
        
        this.productData.product.searchKeywords = res?.data?.searchKeywords || [];
        this.productService.clearProductData();
        this.productService.setProductData(this.productData);
        const url = `${API_CONSTANTS.PRODUCT_ADD_ON}/${this.productId}`;
        // this.router.navigate([`${API_CONSTANTS.PRODUCT_ADD_ON}/${this.productId}`]);
        this.router.navigateByUrl(url);

      },
      (err) => {
        this.isLoading = false;
        this.alertService.warning(err.message);
      }
    );
  }

  removeAt(index: number): void {
    if (this.searchKeywordArr.length > 1) {
      this.searchKeywordArr.removeAt(index);
    }
  }

  ngOnDestroy(): void {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
  }
}

