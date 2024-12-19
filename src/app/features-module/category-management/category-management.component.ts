import { DatePipe, CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../Module/material.module';
import { SearchComponent } from '../subscription-management/Components/search/search.component';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, Routes } from '@angular/router';
import { ConfirmDeleteDialogComponent } from '../../commonComponent/confirm-delete-dialog/confirm-delete-dialog.component';
import { AlertService } from '../../services/Toaster/alert.service';
import { CategoryService } from '../category-management/category-service/category.service';
import { ViewCategoryComponent } from './view-category/view-category.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, DatePipe, CommonModule, SearchComponent,MatProgressSpinnerModule
  ],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})

export class CategoryManagementComponent implements OnInit {
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

  constructor(private _categoryData: CategoryService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router) { }

  displayedColums: string[] = ["S.No.", "name", "image", "totalProduct", "createdAt", "action"]

  ngOnInit(): void {
    this.getCategory(this.page, this.limit);
    this.datasource = new MatTableDataSource<any>(this.allCategoryList);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

getCategory(page: any, limit: any, search: string = '') {
  this.isLoading = true;

    this._categoryData.getCategoryList(page, limit, '', search).subscribe((res: any) => {
      this.allCategoryList = res.data?.categories;
      this.totalItems = res.data.count;
      this.isLoading = false;

      this.datasource.data = this.allCategoryList;
      console.log(res, 'ress>>>>');
    });
  }

  onPaginateChange(event: any, value: string): void {
    console.log(event, 'event>>>>>>>>')
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getCategory(this.page, this.limit)
  }

  // getIndividualHistory(event: any, value: string) {
  //   let page = event.pageIndex + 1;
  //   let limit = event.pageSize;
  //   this.pageIndividual = page;
  //   this.limitIndividual = limit;
  //   this.getPincodelist(this.pageIndividual, this.limitIndividual);
  // }

  redireToCategoryDetails(id: any) {
    this.router.navigate([`/category-management/view/${id}`])
  }

  onCreate(){
    this.router.navigate([`/category-management/create-category`])
  }

  viewAttribute(id:any){
    this.router.navigate([`/category-management/attribute/${id}`])
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this._categoryData.deleteById(id).subscribe((res: any) => {
          this.alertService.success(res.message);
          this.getCategory(this.page, this.limit);
        });
      }
    });
  }


  onSearch(search: string, type: string): void {
    this.search = search;
   
    this.getCategory(this.page, this.limit, search);
    
  }
}
