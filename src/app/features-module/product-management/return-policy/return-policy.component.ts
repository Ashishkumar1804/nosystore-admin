import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product-service/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-return-policy',
  standalone: true,
  templateUrl: './return-policy.component.html',
  styleUrl: './return-policy.component.scss',
  imports: [CommonModule, MatDialogModule, RouterModule, MatProgressSpinnerModule]
})
export class ReturnPolicyComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private dialog: MatDialog, private router: Router){}
  productId: any;
  customData: any;
  isSubmitting = false;
  returnPolicyData: any;
  radioItems = [
    { name: 'Use global policy', policyType: 1 },
    { name: 'Use product’s catalog policy', policyType: 2 },
    { name: 'Use Custom policy', policyType: 3 }
  ];
  selectedPolicyType = 1;
  isLoading = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.productId = params.id;
    });
    this.getReturnPolicyDetail();
  }

  getReturnPolicyDetail(): void {
    this.isLoading = true;
    // this.productService.getReturnPolicy(this.productId).subscribe(
    //   (res) => {
    //     this.returnPolicyData = res.data.result;
    //     if (this.returnPolicyData) {
    //       this.selectedPolicyType = res?.data?.result?.policyType;
    //     }
    //     this.isLoading = false;
    //   },
    //   (err) => {
    //     this.isLoading = false;
    //   }
    // );
  }

  customPolicy(type: any, data: any, category: any): void {
    // const dialogRef = this.dialog.open(AddComponent, {
    //   data: { type: type, data: data, category: category },
    //   maxHeight: '90vh',
    //   height: 'fit-content'
    // });
    // dialogRef.afterClosed().subscribe((res: any) => {
    //   if (res) {
    //     this.customData = res;
    //     console.log(this.customData, 'this.customData==============');
    //   }
    // });
  }

  onItemChange(policyType: number): void {
    this.selectedPolicyType = policyType;
    if (this.returnPolicyData && policyType === 3) {
      this.customPolicy('ProductEdit', this.returnPolicyData, this.productId);
    } else if (policyType === 3) {
      this.customPolicy('ProductAdd', '', this.productId);
    }
  }

  submit(): void {
    this.isSubmitting = true;
    let data: any;
    if (this.selectedPolicyType === 3) {
      data = {
        policyType: this.selectedPolicyType,
        days: this.customData?.days,
        description: this.customData?.description
      };
    } else {
      data = { policyType: this.selectedPolicyType };
    }

    // this.productService.addReturnPolicy(this.productId, data).subscribe(
    //   (res) => {
    //     this.isSubmitting = false;
    //     if (res.data?.product?.isVariants) {
    //       this.router.navigateByUrl(`${PRODUCT_CREATE_VARIANT_ROUTE.url}/${this.productId}`);
    //     } else {
    //       this.router.navigateByUrl(PRODUCT_LIST_ROUTE.url);
    //     }
    //   },
    //   (err) => {
    //     this.isSubmitting = false;
    //   }
    // );
  }
}
