import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../Module/material.module';
import { CommonModule, DatePipe } from '@angular/common';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../services/Toaster/alert.service';
import { Router } from '@angular/router';
import { SearchComponent } from '../subscription-management/Components/search/search.component';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, DatePipe, CommonModule, SearchComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})

export class OrdersComponent implements OnInit {
  datasource: any;
  totalItems!: number;
  page: number = 1;
  limit: number = 10;
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  userlist: any[] = [];
  pageAll: number = 1;
  limitAll: number = 10;
  pageIndividual: number = 1;
  limitIndividual: number = 10;
  pageOwner: number = 1;
  limitOwner: number = 10;
  allUserList: any
  search = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _userData: OrderService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router) { }

  displayedColums: string[] = ["S.No.", "name", "amount", "orderId", "createdAt"]

  ngOnInit(): void {
    this.getAllOrders(this.pageAll, this.limitAll);
    this.datasource = new MatTableDataSource<any>(this.allUserList);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }
  getAllOrders(page: any, limit: any, search: string = '') {
    this._userData.getOrderList(page, limit, search).subscribe((res: any) => {
      this.allUserList = res.data.list;
      this.totalItems = res.data.count;
      this.datasource.data = this.allUserList;
    });
  }

  onPaginateChange(event: any, value: string): void {
    let page = event.pageIndex + 1;
    let limit = event.pageSize;
    this.pageAll = page;
    this.limitAll = limit;
    this.getAllOrders(this.pageAll, this.limitAll)
  }

  checkUserType(value: any) {
    // if (value === 'all') {
    //   this.getAllUsers(this.pageAll, this.limitAll);
    // } else if (value === 'individual') {
    //   this.getUserlist(this.pageIndividual, this.limitIndividual);
    // } else {
    //   this.getTeamhistory(this.pageOwner, this.limitOwner);
    // }
  }

  selectSubscriptionType(event: any) {
    // if (event.index === 1) {
    //   this.getUserlist(this.pageIndividual, this.limitIndividual);
    // } else if (event.index === 2) {
    //   this.getTeamhistory(this.pageOwner, this.limitOwner);
    // } else {
    //   this.getAllUsers(this.pageAll, this.limitAll);
    // }
  }

  toggleStatus(id: string, type: string) {
    // this._userData.updateUserStatus(id).subscribe((res: any) => {
    //   if (res) {
    //     this.alertService.success(res.message);
    //     this.checkUserType(type)
    //   }
    // }, (err) => {
    //   this.checkUserType(type)
    //   this.alertService.error(err.error.message);
    // })
  }

  redireToUserDetails(id: any) {
    this.router.navigate([`/user-details/${id}`])
  }


  onSearch(search: string, type: string): void {
    this.search = search;
    // if (type === 'all') {
    //   this.getAllUsers(this.pageAll, this.limitAll, search);
    // } else if (type === 'individual') {
    //   this.getUserlist(this.pageIndividual, this.limitIndividual, search);
    // } else {
    //   this.getTeamhistory(this.pageOwner, this.limitOwner, search);
    // }
  }
}
