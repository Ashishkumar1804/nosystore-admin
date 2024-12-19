import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DataService } from '../../../services/data.service';
import { AlertService } from '../../../services/Toaster/alert.service';
import { OrderService } from '../../orders/order.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  orderId: any;
  billingAndShippingSame: boolean = false;
  billingAddress: any;
  shippingAddress: any;
  order: any;
  products: any;
  isLoading = false;
  label: any;
  paymentStatus: { text?: string, className?: string } = {};
  cancelOrderForm: FormGroup = this.formBuilder.group({
    reason: ['', Validators.required]
  });

  baseUrl = environment.baseUrl;
  subscriptionImages: any = {
    'GOLD': '/assets/images/gold.png',
    'SILVER': '/assets/images/silver.png',
    'BRONZE': '/assets/images/bronze.png',
    'MINI': '/assets/images/mini.png',
    'MAJOR': '/assets/images/major.png',
    'MAX': '/assets/images/max.png',
  };
  @ViewChild('openDialog') openDialog!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.headerData.next({
      headerText: 'Order Detail',
      isHandset: false,
    });

    this.route.params.subscribe((res: any) => {
      this.orderId = res.id;
      this.getOrderDetails();
    });
  }

  getOrderDetails() {
    this.isLoading = true;
    this.orderService.getOrderDetail(this.orderId).subscribe(
      (res) => {
        console.log(res, 'res>>>>>>')
        this.order = res.data.data;
        this.label = res.data?.data?.shipping?.labelUrl;
        this.billingAndShippingSame = res?.data?.data?.billingAndShippingSame;
        this.products = res?.data?.data?.products;
        // this.paymentStatus = this.orderService.getPaymentStatusText(this.order.paymentStatus);
        if (this.billingAndShippingSame) {
          this.billingAddress = res?.data?.data?.shippingAddress;
          this.shippingAddress = res?.data?.data?.shippingAddress;
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

 

  cancel() {
    this.dialog.open(this.openDialog, {
      height: 'fit-content',
      width: '450px',
      panelClass: 'custom-modalbox',
    });
  }

  

  close() {
    this.dialog.closeAll();
    this.cancelOrderForm.reset();
  }

  // markAsDelivered() {
  //   this.isLoading = true;
  //   this.orderService.markAsDelivered(this.order?._id).subscribe(
  //     (res: any) => {
  //       this.alert.success(res?.message);
  //       this.getOrderDetails();
  //       this.isLoading = false;
  //     },
  //     (err) => {
  //       this.alert.danger(err.message);
  //       this.isLoading = false;
  //     }
  //   );
  // }

  productDetails(productId: string): void {
    // this.router.navigateByUrl(`${PRODUCT_DETAILS_ROUTE.url}/${productId}`);
  }

  groupDetails(groupId: string): void {
    // this.router.navigateByUrl(`${GROUP_DETAILS_ROUTE.url}/${groupId}`);
  }
}
