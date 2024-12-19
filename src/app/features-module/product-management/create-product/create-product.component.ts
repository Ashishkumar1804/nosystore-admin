
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { DataService } from '../../../services/data.service';
import { ProductService } from '../product-service/product.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../services/Toaster/alert.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Component({
  selector: 'app-create-product',
  standalone: true,
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
  imports: [CommonModule, RouterModule, MatRadioModule, MatListModule]
})
export class CreateProductComponent implements OnInit, OnDestroy {
  fullUrl: any;
  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private dataService: DataService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router) { }

  product: any;
  variant: any;
  catalogRoute = "PRODUCT_CATALOG_ROUTE";
  brandRoute = "PRODUCT_BRAND_ROUTE";
  selectedVariant = 2;
  checkBoxDisabled = false;

  productDataSubs: Subscription | undefined;

  navigationMenu = [
    { route: `${API_CONSTANTS.PRODUCT_CATEGORY}`, isActive: true, title: 'Catalog' },
    { route:`${ API_CONSTANTS.PRODUCT_BRAND}`, isActive: false, title: 'General Info' },
    { route: `${API_CONSTANTS.PRODUCT_ATTRIBUTE}`, isActive: false, title: 'Attributes' },
    { route:`${API_CONSTANTS.PRODUCT_IMAGE}`, isActive: false, title: 'Photos' },
    { route: `${API_CONSTANTS.PRODUCT_PRICE_INVENTORY}`, isActive: false, title: 'Price Details & Inventory' },
    { route: `${API_CONSTANTS.PRODUCT_MAUFACTURING_DETAIL}`, isActive: false, title: 'Manufacturing Details' },
    { route: `${API_CONSTANTS.PRODUCT_SEARCH_KEYWORD}`, isActive: false, title: 'Search Keywords' },
    // { route: `${API_CONSTANTS.PRODUCT_WARRANTY}`, isActive: false, title: 'Warranty' },
    { route: `${API_CONSTANTS.PRODUCT_ADD_ON}`, isActive: false, title: 'Add On' },
    { route: `${API_CONSTANTS.PRODUCT_ADD_ON}`, isActive: false, title: 'Variants' },
    // { route: `${API_CONSTANTS.PRODUCT_RETURN_POLICY}`, isActive: false, title: 'Return & Cancellation Policy' },
    { route: `${API_CONSTANTS.PRODUCT_ADD_ON}`, isActive: false, title: 'Variants' },
  ];

  
  ngOnInit(): void {

    this.fullUrl = this.router.url;
    this.activatedRoute.url.subscribe(() => {
      this.setNavigationMenu();
    });

    console.log(this.fullUrl, 'this.fullUrl>>>')
    this.getProductData();    
    this.activatedRoute.params.subscribe((params: any) => {
      console.log(params);
    });
    // this.dataService.headerData.next({ headerText: 'Product Listing', isHandset: true });
  }

  private getProductData(): void {

    this.productDataSubs = this.productService.productData.subscribe((data: any) => {
      console.log(data, 'this.productDataSubs')
      if (data && data?.product) {
        this.product = data?.product;
        this.variant = data?.variant || {};
        this.checkBoxDisabled = true;
        this.selectVariant(this.product?.isVariants ? 2 : 1);
      }
    });
  }

  setNavigationMenu(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    console.log(urlTree, 'urlTree>>>>>')
    const segments = urlTree.root.children['primary']?.segments.map(segment => segment.path) || [];
    const productIndex = segments.indexOf('product');
    const createIndex = segments.indexOf('create');
    const productId = segments[createIndex + 2] || null;
    const variantId = segments[createIndex + 3] || null;

    console.log(productId, this.product, variantId, productIndex, createIndex, 'createIndex>>>>!!!!')
  
    if (productId && !this.product) {
      this.productService.getProductDetailsWithVariant(productId).subscribe((res: any) => {
        const product = res.data.product;
        let variant = res.data.productVariants[0] || {};
        if (variantId && !this.variant) {
          variant = res.data.productVariants.find((e: any) => e._id === variantId);
        }
  
        this.productService.setProductData({ product, variant });
        // const activeIndex = this.navigationMenu.findIndex(e => segments.includes(e.route));
        const activeIndex = this.navigationMenu.findIndex(menu => {
          // Split the route of the current menu item into segments
          const routeSegments = menu.route.split('/');      
          // Compare the first three segments of both arrays
          return routeSegments.slice(0, 3).join('/') === segments.slice(0, 3).join('/');
        });
        this.navigate(this.navigationMenu[activeIndex], activeIndex, true);
      });
    } else {

      // console.log(this.navigationMenu, segments,'this.navigationMenu>>>>>>>>>>>>>>>>')
      // const activeIndex = this.navigationMenu.findIndex(e => segments.includes(e.route));
     
      const activeIndex = this.navigationMenu.findIndex(menu => {
        // Split the route of the current menu item into segments
        const routeSegments = menu.route.split('/');      
        // Compare the first three segments of both arrays
        return routeSegments.slice(0, 3).join('/') === segments.slice(0, 3).join('/');
      });
      
      // console.log(activeIndex, 'activeIndex>>>>')
      this.navigate(this.navigationMenu[activeIndex], activeIndex, true);
    }
  }
  

  selectVariant(selectedVariant: number): void {
    this.selectedVariant = selectedVariant;
    this.productService.selectedVariant.next(selectedVariant);
  }

  navigate(menu: any, index: number, fromUrl: boolean = false): void {

    console.log(menu, index, fromUrl, 'navigate>>>')
    this.navigationMenu = this.navigationMenu.map((e: any) => {
      e.isActive = false;
      return e;
    });
    if(menu){

      menu.isActive = true;
  
      console.log(menu, 'menu>>>>>>>>')
    }
    if (fromUrl) return;
    let url = menu.route;
    // let url = menu.route.url;
    if ((index === 2 || index === 3  || index === 4 ) && this.product && this.product._id) {
      console.log(this.product, this.variant,'this.product')
      url += `/${this.product._id}`;
      if (this.variant && this.variant._id) 
        url += `/${this.variant._id}`;
    } else if (index > 0) {
      url += `/${this.product._id}`;
    }

    // console.log(url, 'url>>>');
    // const redirectUrl:any = `${this.fullUrl}/${url}`;
    // console.log(this.fullUrl ,url, 'url>>>>', `${this.fullUrl}/${url}`)
    // this.router.navigate(['product/create/product-category']);
    // this.router.navigate([`${API_CONSTANTS.PRODUCT_CATEGORY}`]);

    this.router.navigateByUrl(url);
  }

  showMenu(i: number): boolean {
    return !(i === this.navigationMenu.length - 1 && !this.product?.isVariants);
  }

  ngOnDestroy(): void {
    this.productService.clearProductData();
    if (this.productDataSubs) this.productDataSubs.unsubscribe();
    this.productService.productData.next(null);
  }
}

