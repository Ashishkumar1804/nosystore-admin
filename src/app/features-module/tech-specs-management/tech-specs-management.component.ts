import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../Module/material.module';
import { CommonModule, DatePipe } from '@angular/common';
import { SearchComponent } from '../subscription-management/Components/search/search.component';
import { ThemePalette } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../services/Toaster/alert.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { TechSpecsService } from './service/tech-specs.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-tech-specs-management',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, DatePipe, CommonModule, SearchComponent,MatProgressSpinnerModule],
  templateUrl: './tech-specs-management.component.html',
  styleUrl: './tech-specs-management.component.scss'
})
export class TechSpecsManagementComponent {

  datasource: any;
  totalItems!: number;
  page: number = 1;
  limit: number = 10;
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  categorylist: any[] = [];
  allCategoryList: any
  search = '';
  isLoading = false; // Loader flag
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  allPincodeList: any;
  allTechSpecList: any[] | undefined;

  constructor(private techSpecsService: TechSpecsService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private router: Router) { }

  displayedColums: string[] = ["S.No.", "title", "logo", "createdAt", "action"]

  ngOnInit(): void {
    this.getTechSpecs(this.page, this.limit);
    this.datasource = new MatTableDataSource<any>(this.allTechSpecList);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

 getTechSpecs(page: any, limit: any, search: string = '') {
  this.isLoading = true;

    this.techSpecsService.getList(page, limit, '', search).subscribe((res: any) => {
      this.isLoading = false;
      this.allTechSpecList = res.data?.techSpecs;
      this.datasource = this.allTechSpecList;
      this.totalItems = res.data.count;
      console.log(res, 'ress>>>>');
    });
  }

  onPaginateChange(event: any, value: string): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getTechSpecs(this.page, this.limit)
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
    this.router.navigate([`/tech-specs/create`])
  }


  redireToTechDetails(id: any) {
    this.router.navigate([`/tech-specs/view-edit/${id}`])
  }


  onSearch(search: string, type: string): void {
    this.search = search;
   
    this.getTechSpecs(this.page, this.limit, search);
    
  }


}
