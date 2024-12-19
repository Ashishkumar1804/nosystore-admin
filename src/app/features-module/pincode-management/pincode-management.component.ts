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
import { PincodeService } from './pincode-service/pincode.service';
import { Router } from '@angular/router';
import { SearchComponent } from '../subscription-management/Components/search/search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDeleteDialogComponent } from '../../commonComponent/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, DatePipe, CommonModule, SearchComponent,MatProgressSpinnerModule
  ],
  templateUrl: './pincode-management.component.html',
  styleUrl: './pincode-management.component.scss'
})


export class PincodeManagementComponent implements OnInit {
  datasource: any;
  totalItems!: number;
  page: number = 1;
  limit: number = 10;
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  userlist: any[] = [];
  allPincodeList: any
  isLoading:boolean = false;
  search = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pincodeService: PincodeService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router) { }

    displayedColums: string[] = ["S.No.", "pincode", "country", "state", "city", "createdAt", "status", "action"]

  ngOnInit(): void {
    this.getAllPincodes(this.page, this.limit);
    this.datasource = new MatTableDataSource<any>(this.allPincodeList);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  getAllPincodes(page: any, limit: any, search: string = '') {
    this.isLoading = true;
    this.pincodeService.getPincodeList(page, limit, '', search).subscribe((res: any) => {
      this.allPincodeList = res.data.pincodes;
      this.totalItems = res.data.totalCount;
      this.datasource.data = this.allPincodeList;
      this.isLoading = false;
    });
  }

  onPaginateChange(event: any, value: string): void {
    let page = event.pageIndex + 1;
    let limit = event.pageSize;
    this.page = page;
    this.limit = limit;
    this.getAllPincodes(this.page, this.limit)
  }

  redireToPincodeDetails(id: any) {
    this.router.navigate([`/pincode-management/${id}`])
  }

  onCreatePincode(){
    this.router.navigate([`/pincode-management/create`])
  }

  deletePincode(id: any){
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.pincodeService.deletePincodeById(id).subscribe((res: any) => {
          this.alertService.success(res.message);
          this.getAllPincodes(this.page, this.limit);
        });
      }
    });
  }



  onSearch(search: string, type: string): void {
    this.search = search;
    
    this.getAllPincodes(this.page, this.limit, search);
    // if (type === 'all') {
    //   this.getAllPincodes(this.page, this.limit, search);
    // } else if (type === 'individual') {
    //   // this.getUserlist(this.pageIndividual, this.limitIndividual, search);
    // } else {
    //   // this.getTeamhistory(this.pageOwner, this.limitOwner, search);
  }

  toggleStatus(id: string, type: string) {
    this.pincodeService.updatePincodeStatus(id).subscribe((res: any) => {
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





