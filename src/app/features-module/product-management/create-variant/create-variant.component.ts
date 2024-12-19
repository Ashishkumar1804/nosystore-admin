import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product-service/product.service';
import { AlertService } from '../../../services/Toaster/alert.service';
import { API_CONSTANTS } from '../../../Constants/api.constant';

@Component({
  selector: 'app-create-variant',
  standalone: true,
  imports: [
    CommonModule,


  ],
  templateUrl: './create-variant.component.html',
  styleUrl: './create-variant.component.scss'
})
export class CreateVariantComponent {
  productId: any;
  productData: any;
  productVarients: any;
  attributesValues: string[] = [];
  constructor(
    private $activatedRoute: ActivatedRoute,
    private $productService: ProductService,
    private $alert: AlertService,

    private router: Router,

  ) { }

  ngOnInit(): void {
    this.$activatedRoute.params.subscribe((params: any) => {
      this.productId = params.id;
    })
    this.getProductDetails();

    // this.getAttributeList();
  }

  private getProductDetails() {
    // this.isLoading = true;
    this.$productService.getProductDetailsWithVariant(this.productId).subscribe((res) => {
      // this.isPageLoading = false;
      const product = res?.data?.product;
      this.productVarients = res?.data?.productVariants;
      this.productData = { product };
      console.log(this.productVarients)
    }, (err) => {

      this.$alert.error(err.message);
    })
  }

  createNewVariant(){
    let url = `${API_CONSTANTS.PRODUCT_ATTRIBUTE}/${this.productId}`;
    this.router.navigateByUrl(url);
  }



}
