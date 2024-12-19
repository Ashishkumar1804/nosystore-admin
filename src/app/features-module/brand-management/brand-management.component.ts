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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-brand-management',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, DatePipe, CommonModule, SearchComponent,MatProgressSpinnerModule],
  templateUrl: './brand-management.component.html',
  styleUrl: './brand-management.component.scss'
})

export class BrandManagementComponent implements OnInit {
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
  allBrandList: any[] | undefined;

  constructor(private _brandData: BrandService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router) { }

  displayedColums: string[] = ["S.No.", "name", "logo", "category", "createdAt", "action"]

  ngOnInit(): void {
    this.getBrand(this.page, this.limit);
    this.datasource = new MatTableDataSource<any>(this.allBrandList);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

getBrand(page: any, limit: any, search: string = '') {
  this.isLoading = true;

    this._brandData.getList(page, limit, '', search).subscribe((res: any) => {
      this.isLoading = false;
      this.allBrandList = res.data?.brands;
      this.datasource = this.allBrandList;
      this.totalItems = res.data.count;
    });
  }

  onPaginateChange(event: any, value: string): void {
    let page = event.pageIndex + 1;
    let limit = event.pageSize;
    this.page = page;
    this.limit = limit;
    this.getBrand(this.page, this.limit)
  }

  // getIndividualHistory(event: any, value: string) {
  //   let page = event.pageIndex + 1;
  //   let limit = event.pageSize;
  //   this.pageIndividual = page;
  //   this.limitIndividual = limit;
  //   this.getPincodelist(this.pageIndividual, this.limitIndividual);
  // }

  redireToCategoryDetails(id: any) {
    this.router.navigate([`/category-detail/${id}`])
  }

  onCreate(){
    this.router.navigate([`/brand-management/create`])
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this._brandData.deleteById(id).subscribe((res: any) => {
          this.alertService.success(res.message);
          this.getBrand(this.page, this.limit);          
        });
      }
    });
  }

  redireToBrandDetails(id: any) {
    this.router.navigate([`/brand-management/view/${id}`])
  }

  onSearch(search: string, type: string): void {
    this.search = search;
   
    this.getBrand(this.page, this.limit, search);
    
  }
}
