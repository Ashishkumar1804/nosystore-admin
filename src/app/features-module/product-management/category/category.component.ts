import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime, delay, fromEvent, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../services/Toaster/alert.service';
import { ProductService } from '../product-service/product.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Component({
  selector: 'app-category',
  standalone: true, // Make the component standalone
  imports: [
    CommonModule, // Import necessary Angular modules
    RouterModule,
    FormsModule,

     // For two-way binding and form controls
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  categoryList: [any][] = [];
  @ViewChild('search') searchElement: any;
  search: string = '';
  highlightedList: string = '';
  ul: number[] = [];
  index = 0;
  categoryId: string = '';
  categoriesList: any[] = [];
  searchSubs: Subscription | undefined;
  isVariant: boolean = true;

  productId: string = '';
  productData: any;

  isPageLoading = false;

  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit>>>>>');
    this.isPageLoading = true;
    this.getCategoryList();
    this.productService.selectedVariant.subscribe((variant: number) => {
      this.isVariant = variant === 2;
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.productId = params.id;
    });

    this.productService.productData.pipe(delay(0)).subscribe((data: any) => {
      if (data) { // Check if data exists before assigning it
        this.productData = data;
      } else {
        console.warn('productData is undefined');
        // Optional: handle this case, for example, by initializing an empty object
        this.productData = {};
      }
    });
  }

  ngAfterViewInit(): void {
    this.getSearch();
  }

  getCategoryList(searchText: any = null, cb?: () => void) {
    // console.log('getCategoryList>>>');
    this.productService.getCategoriesList(searchText).subscribe((data: any) => {
      console.log(data, 'getCategoryList>>>>>')
      const categories = data.data.categories.map((e: any) => {
        e.isSelected = false;
        e.isLoading = false;
        return e;
      });
      this.isPageLoading = false;
      if (cb) cb();
      this.categoriesList.push(categories);
    }, err => {
      this.isPageLoading = false;
      if (cb) cb();
    });
  }


  selectCategory(category: any, listIndex: number): void {
    this.categoriesList[listIndex].map((e: any) => {
      e.isSelected = false;
      e.isLoading = false;
    });
    this.categoriesList = this.categoriesList.filter((e: any, i: number) => i <= listIndex);
    category.isSelected = true;

    console.log(category, listIndex, 'listIndex>>>>' )
    category.isAttributeAdded = true;
    if (category.isAttributeAdded) {
      if (this.productId) {
        this.router.navigateByUrl(`${API_CONSTANTS.PRODUCT_BRAND}/${this.productId}`);
        return;
      }
      let catalogData = { categoryId: category._id, isVariants: this.isVariant };
      this.productService.addCategory(catalogData).subscribe((data) => {

        console.log(data, 'data>>>>>>>>')
        const product = data.data;
        this.productService.clearProductData();
        this.productService.setProductData({ product });
        this.alertService.success(data.message);
        this.router.navigateByUrl(`${API_CONSTANTS.PRODUCT_BRAND}/${product._id}`);
        // console.log(`${API_CONSTANTS.PRODUCT_BRAND}/${product._id}`, 'product_brand>>>>>>>');
        // this.router.navigate([`${API_CONSTANTS.PRODUCT_BRAND}/${product._id}`]);
      }, err => {
        // this.alertService.danger(err.message);
      });
    } else {
      category.isLoading = true;
      this.categoryId = category._id;
      this.getCategoryList(null, () => {
        category.isLoading = false;
      });
    }
  }

  private getSearch() {
    this.categoryId = '';
    this.searchSubs = fromEvent<any>(this.searchElement.nativeElement, 'input').pipe(
      debounceTime(500)
    ).subscribe((event: any) => {
      this.search = event.target.value;
      if (this.search && this.search.trim()) {
        this.categoriesList = [];
        this.getCategoryList(this.search);
      }
      if (!this.search) {
        this.categoriesList = [];
        this.getCategoryList(this.search);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubs) {
      this.searchSubs.unsubscribe();
    }
  }
}

