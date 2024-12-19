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
import { BrandService } from '../brand-management/brand-service/brand.service';
import { SearchComponent } from '../subscription-management/Components/search/search.component';
import { WarrantyService } from './warranty-service/warranty.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-warranty-management',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, DatePipe, CommonModule, SearchComponent,MatProgressSpinnerModule],
  templateUrl: './warranty-management.component.html',
  styleUrl: './warranty-management.component.scss'
})

export class WarrantyManagementComponent implements OnInit {
  datasource: any;
  totalItems!: number;
  page: number = 1;
  limit: number = 10;
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  categorylist: any[] = [];
  pageAll: number = 1;
  limitAll: number = 10;
  pageIndividual: number = 1;
  limitIndividual: number = 10;
  pageOwner: number = 1;
  limitOwner: number = 10;
  allCategoryList: any
  isLoading = false; // Loader flag

  search = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  allPincodeList: any;

  constructor(private warrantyService: WarrantyService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router) { }

  displayedColums: string[] = ["S.No.", "name", "price", "year", "createdAt", "action"]

  ngOnInit(): void {
    this.getWarranty(this.pageAll, this.limitAll);
    this.datasource = new MatTableDataSource<any>(this.allCategoryList);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

getWarranty(page: any, limit: any, search: string = '') {
  this.isLoading = true;

    this.warrantyService.getList(page, limit, search).subscribe((res: any) => {
      console.log(res, 'res>>>>');
      this.isLoading = false;

      this.datasource = res.data?.productWarranty;
      this.totalItems = res.data.count;
      console.log(res, 'ress>>>>');
    });
  }

  onPaginateChange(event: any, value: string): void {
    let page = event.pageIndex + 1;
    let limit = event.pageSize;
    this.pageAll = page;
    this.limitAll = limit;
    this.getWarranty(this.pageAll, this.limitAll)
  }

  // getIndividualHistory(event: any, value: string) {
  //   let page = event.pageIndex + 1;
  //   let limit = event.pageSize;
  //   this.pageIndividual = page;
  //   this.limitIndividual = limit;
  //   this.getPincodelist(this.pageIndividual, this.limitIndividual);
  // }

  redireToDetails(id: any) {
    this.router.navigate([`/warranty-management/detail/${id}`])
  }

  onCreate(){
    this.router.navigate([`/warranty-management/create`])
  }

  // delete(id: any){
  //   const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result){
  //       this.warrantyService.deleteById(id).subscribe((res: any) => {
  //         this.alertService.success(res.message);
  //         this.getBrand(this.pageAll, this.limitAll);          
  //       });
  //     }
  //   });
  // }


  onSearch(search: string, type: string): void {
    this.search = search;
   
    this.getWarranty(this.pageAll, this.limitAll, search);
    
  }
}
