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
import { UserService } from './user-service/user.service';
import { Router } from '@angular/router';
import { SearchComponent } from '../subscription-management/Components/search/search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, DatePipe, CommonModule, SearchComponent,MatProgressSpinnerModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})


export class UserManagementComponent implements OnInit {
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
  isLoading:boolean = false;
  search = '';
  deletedType = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  allDeletedUserList: any;
  totalDeletedItems: any;
  datasourceForDeleted: any;

  constructor(private userService: UserService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router) { }

  displayedColums: string[] = ["S.No.", "name", "gender", "age", "phoneNumber","address", "isAccountActive", "isProfileCompleted", 'createdAt', 'action']

  ngOnInit(): void {
    this.getAllUsers(this.pageAll, this.limitAll);
    this.getAllDeletedUsers(this.pageAll, this.limitAll);
    this.datasource = new MatTableDataSource<any>(this.allUserList);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;

    this.datasourceForDeleted = new MatTableDataSource<any>(this.allDeletedUserList);
    this.datasourceForDeleted.paginator = this.paginator;
    this.datasourceForDeleted.sort = this.sort;
  }

  getAllUsers(page: any, limit: any, search: string = '') {
    this.isLoading = true;
    this.userService.getUserList(page, limit, '', search, this.deletedType).subscribe((res: any) => {
      this.allUserList = res.data.user;
      this.totalItems = res.data.count;
      this.deletedType = false;
      this.datasource.data = this.allUserList;
      this.isLoading = false;
    });
  }

  getAllDeletedUsers(page: any, limit: any, search: string = '') {
    this.isLoading = true;
    this.deletedType = true;
    this.userService.getUserList(page, limit, '', search, this.deletedType).subscribe((res: any) => {
      console.log(res, 'ressssssssssss>>>>>>>>>>')
      this.allDeletedUserList = res.data.user;
      this.deletedType = true
      // this.totalDeletedItems = res.data.count;
      this.datasourceForDeleted.data = this.allDeletedUserList;
      // this.isLoading = false;
    });

    console.log(this.allDeletedUserList, 'datasourceForDeleted>>>>>>>>>>')
  }

  onPaginateChange(event: any, value: string): void {
    let page = event.pageIndex + 1;
    let limit = event.pageSize;
    this.pageAll = page;
    this.limitAll = limit;
    this.getAllUsers(this.pageAll, this.limitAll)
  }

  

  // toggleStatus(id: string, type: string) {
  //   this.userService.updateUserStatus(id).subscribe((res: any) => {
  //     if (res) {
  //       this.alertService.success(res.message);
  //       this.checkUserType(type)
  //     }
  //   }, (err) => {
  //     this.checkUserType(type)
  //     this.alertService.error(err.error.message);
  //   })
  // }

  redireToUserOrder(id: any, deletedType:any) {
    this.router.navigate([`user/order/${id}/${deletedType}`])
  }


  onSearch(search: string, type: string): void {
    this.search = search;
    
    this.getAllUsers(this.pageAll, this.limitAll, search);
    // if (type === 'all') {
    //   this.getAllUsers(this.pageAll, this.limitAll, search);
    // } else if (type === 'individual') {
    //   // this.getUserlist(this.pageIndividual, this.limitIndividual, search);
    // } else {
    //   // this.getTeamhistory(this.pageOwner, this.limitOwner, search);
  }

  toggleStatus(id: string, type: string) {
    this.userService.updateUserStatus(id).subscribe((res: any) => {
      if (res) {
        this.alertService.success('Status updated successfully');
      }
    }, (err) => {
      this.alertService.error(err.error.message);
    })
  }

  selectSubscriptionType(event:any){
  }


}





