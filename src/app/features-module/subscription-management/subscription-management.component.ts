import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../Module/material.module';
import { SubscriptionService } from './SubscriptionService/subscription.service';
import { DatePipe } from '@angular/common';
import { ThemePalette } from '@angular/material/core';
import { CreateSubscriptionComponent } from './Components/create-subscription/create-subscription.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../commonComponent/confirm-dialog/confirm-dialog.component';
import { AlertService } from '../../services/Toaster/alert.service';
import { ViewSubscriptionComponent } from './Components/view-subscription/view-subscription.component';

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MaterialModule,
    DatePipe, CreateSubscriptionComponent,
    ConfirmDialogComponent, ViewSubscriptionComponent],
  templateUrl: './subscription-management.component.html',
  styleUrl: './subscription-management.component.scss'
})
export class SubscriptionManagementComponent implements OnInit {
  datasource: any;
  totalItems!: number;
  page: number = 1;
  limit: number = 10;
  pagehistory: number = 1;
  limithistory: number = 10;
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  individualPlanlist: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _subscriptionData: SubscriptionService,
    private dialog: MatDialog, private alertService: AlertService) { }

  displayedColums: string[] = ["S.No", "planTitle", "members", "planType", "price", "discount", "createdAt", "status", "action"]


  ngOnInit(): void {
    this.getSubscriptionlist(this.page, this.limit);
    this.datasource = new MatTableDataSource<any>(this.individualPlanlist);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  getSubscriptionlist(page: any, limit: any) {
    this._subscriptionData.getSubscriptionList(page, limit, 1).subscribe((res: any) => {
      this.individualPlanlist = res.data.Subscriptions;
      this.totalItems = res.data.totalDocuments;
      this.datasource.data = this.individualPlanlist;
    })
  }

  getSubscriptionhistory(page: any, limit: any) {
    this._subscriptionData.getSubscriptionList(page, limit, 2).subscribe((res: any) => {
      this.individualPlanlist = res.data.Subscriptions;
      this.totalItems = res.data.totalDocuments;
      this.datasource.data = this.individualPlanlist;
    })
  }

  onPaginateChange(event: any, type: any): void {
    let page = event.pageIndex;
    let limit = event.pageSize;
    if (type === 'list') {
      this.page = page;
      this.limit = limit;
      this.getSubscriptionlist(this.page, this.limit)
    } else {
      this.pagehistory = page;
      this.limithistory = limit;
      this.getSubscriptionhistory(this.pagehistory, this.limithistory)
    }
  }


  createSubscriptionPlan() {
    const dialogRef = this.dialog.open(CreateSubscriptionComponent, {
      width: '50%',
      height: "auto",
      data: { data: "", key: 'add' }
      // enterAnimationDuration: '1000ms',
      // exitAnimationDuration: '1000ms',
    })

    dialogRef.afterClosed().subscribe((res: any) => {
      this.getSubscriptionlist(this.page, this.limit);
    })
  }

  editSubscription(editData: any) {
    const dialogRef = this.dialog.open(CreateSubscriptionComponent, {
      width: '50%',
      height: "auto",
      data: { data: editData, key: 'edit' }
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      this.getSubscriptionlist(this.page, this.limit);
    })
  }


  viewSubscription(viewData: any) {
    const dialogRef = this.dialog.open(ViewSubscriptionComponent, {
      width: '30%',
      height: "50%",
      data: { data: viewData, key: 'edit' }
    })
  }

  deleteSubscription(deleteData: any, type: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { width: '250px', disableClose: true, data: { message: "Are you sure you want to Delete" } })
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.deleteSubscriptionPlan(deleteData, type)
      }
    })

  }




  deleteSubscriptionPlan(deleteData: any, type: any) {
    this._subscriptionData.deleteSubscriptionPlan(deleteData._id).subscribe((res: any) => {
      if (res) {
        this.alertService.info(res.message);
        if (type == 'Active') {
          console.log(type)
          this.getSubscriptionlist(this.page, this.limit);
        } else {
          this.getSubscriptionhistory(this.pagehistory, this.limithistory);
        }
      }
    }, (error) => {
      this.alertService.error(error.message)
    })
  }

  selectSubscriptionType(event: any) {
    if (event.index == 1) {
      this.getSubscriptionhistory(this.pagehistory, this.limithistory);
    } else {
      this.getSubscriptionlist(this.page, this.limit);
    }
  }

  toggleStatus(id: string, type: string) {
    this._subscriptionData.toggleStatus(id).subscribe((res: any) => {
      if (res) {
        this.alertService.success(res.message);
        if (type == 'Active') {
          this.getSubscriptionlist(this.page, this.limit);
        } else {
          this.getSubscriptionhistory(this.pagehistory, this.limithistory);
        }
      }
    })
  }

  getSerialNumber(index: number): number {
    const currentPage = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : this.limit;
    return currentPage * pageSize + index + 1;
  }


}
