import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { DataService } from '../../../services/data.service';
import { AlertService } from '../../../services/Toaster/alert.service';
import { ProductService } from '../product-service/product.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatList, MatListItem } from '@angular/material/list';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { API_CONSTANTS } from '../../../Constants/api.constant';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTableModule,
    MatGridListModule,
    MatListItem,
    MatList,
    MatTab,
    MatTabGroup,
    MatProgressSpinnerModule,
    MatCard
    
    // CarouselModule // Import for ngx-owl-carousel-o
  ],
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  baseUrl = environment.baseUrl;
  isLoading: boolean = false;
  customOptions:any = {
    loop: true,
    dots: true,
    navSpeed: 600,
    autoplay: true,
    autoplayTimeout: 2000,
    responsive: {
      0: { items: 1 },
      400: { items: 1 },
      760: { items: 1 },
      1000: { items: 1 },
    },
  };

  productId: any;
  productDetails: any;
  selectedImageIndex = 0;
  photos: string[] = [];
  productVariants: any[] = [];
  selectedVariant: any;
  selectedTab = 2;
  ratingsArr = [1, 2, 3, 4, 5];
  @Input() starRating: number = 0; 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private alert: AlertService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.headerData.next({
      isHandset: false,
      headerText: 'product details',
    });
    this.route.params.subscribe((res: any) => {
      this.productId = res.id;
      this.getProductDetails();
    });
  }

  ngAfterViewInit(): void {}

  private getProductDetails() {
    this.isLoading = true;
    this.productService.getProductDetails(this.productId).subscribe(
      (res: any) => {

        console.log(res, 'res>>>');
        this.isLoading = false;
        this.productDetails = res.data.product;
        this.productVariants = res.data?.productVariants;
        this.selectedVariant = this.productVariants[0];
        this.photos.push(this.productDetails.coverPhoto, ...this.selectedVariant.photos);
        
      },
      (err) => {
        this.isLoading = false;
        this.alert.warning(err.message);
      }
    );
  }

  onPhotoChange(index: number): void {
    this.selectedImageIndex = index;
  }

  showDescription(): void {
    this.selectedTab = 1;
    const element = document.getElementById('product-description');
    if (element) element.innerHTML = this.productDetails.description;
  }

  edit(variant: any) {
    this.selectedVariant = variant;
    // this.router.navigateByUrl(
    //   // `{PRODUCT_ATTRIBUTES_ROUTE.url}/{this.productId}/{this.selectedVariant._id}`
    // );

    let url = `${API_CONSTANTS.PRODUCT_ATTRIBUTE}/${this.productId}/${this.selectedVariant._id}`;
          // let url = `${PRODUCT_ATTRIBUTES_ROUTE.url}/${this.productId}`;
          console.log(url, 'url>>>>');
          this.router.navigateByUrl(url);
  }

  view(variant: any): void {
    this.selectedVariant = variant;
    this.photos = variant.photos;
  }
}

