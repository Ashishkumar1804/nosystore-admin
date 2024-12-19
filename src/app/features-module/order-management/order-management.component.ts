import { DatePipe, CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../Module/material.module';
import { ConfirmDeleteDialogComponent } from '../../commonComponent/confirm-delete-dialog/confirm-delete-dialog.component';
import { AlertService } from '../../services/Toaster/alert.service';
import { SearchComponent } from '../subscription-management/Components/search/search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../orders/order.service';
import { OrderCancelDialogComponent } from '../../commonComponent/order-cancel-dialog/order-cancel-dialog.component';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, DatePipe, CommonModule, SearchComponent,MatProgressSpinnerModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})

export class OrderManagementComponent implements OnInit {
  datasource: any;
  totalItems!: number;
  page: number = 1;
  isLoading = false; // Loader flag
  limit: number = 10;
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  categorylist: any[] = [];
  allCategoryList: any
  search = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  allPincodeList: any;
  allOrderList: any[] | undefined;
  constructor(private orderService: OrderService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router) { }

  // displayedColums: string[] = ['S.No.'];
  displayedColums: string[] = ['S.No.', 'createdAt', 'orderNumber', 'name', 'orderStatus', 'amountTotal', 'action'];

  ngOnInit(): void {
    this.getList(this.page, this.limit);
    this.datasource = new MatTableDataSource<any>(this.allOrderList);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

getList(page: any, limit: any, search: string = '') {
  this.isLoading = true;

    this.orderService.getOrderList(page, limit, search).subscribe((res: any) => {
      this.isLoading = false;
      this.allOrderList = res.data?.orders;
      this.datasource = this.allOrderList;
      this.totalItems = res.data.count;
      console.log(this.datasource, 'this.datasource')
    });
  }

  onChange(event: any, value: string): void {
    let page = event.pageIndex + 1;
    let limit = event.pageSize;
    this.page = page;
    this.limit = limit;
    this.getList(this.page, this.limit)
  }
 
  // delete(id: any){
  //   const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result){
  //       this.orderService.deleteById(id).subscribe((res: any) => {
  //         this.alertService.success(res.message);
  //         this.getList(this.page, this.limit);          
  //       });
  //     }
  //   });
  // }

  details(id: any) {
    this.router.navigate([`/brand-management/view/${id}`])
  }

  onSearch(search: string): void {
    this.search = search;
   
    this.getList(this.page, this.limit, search);
    
  }

  onActionChange(element:any, value:any){
    const data = {
      orderStatus:value
    }
    if(value==4){
      this.cancelOrder(element?._id, data)
    }
    else if(value==6){
      this.orderService.updateStatus(element?._id ,data).subscribe((res: any) => {
        this.alertService.success(res.message);
        this.getList(this.page, this.limit);
      });
    }

    else{
      this.router.navigate([`/order-management/order-detail/${element?._id}`])
    }
    console.log(element, 'element', value, 'value>>>>');

  }

  cancelOrder(id:any, value:any){
      const dialogRef = this.dialog.open(OrderCancelDialogComponent);
      console.log(dialogRef, 'dialogRef>>>>>>>')
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          const data = {
            reason:result,
            orderStatus:4
          }
          this.orderService.updateStatus(id, data).subscribe((res: any) => {
            this.alertService.success(res.message);
            this.getList(this.page, this.limit);
          });
        }
      });
    
  }
}
