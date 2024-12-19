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
import { ProductService } from '../product-management/product-service/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, DatePipe, CommonModule, SearchComponent,MatProgressSpinnerModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss'
})

export class ProductManagementComponent implements OnInit {
  datasource: any;
  totalItems!: number;
  page: number = 1;
  limit: number = 10;
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  categorylist: any[] = [];
  allProductList: any
  search = '';
  isLoading = false; // Loader flag
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  allPincodeList: any;

  constructor(private productService: ProductService,
    private dialog: MatDialog,
    private alertService: AlertService,

    private router: Router) { }

  displayedColums: string[] = ["S.No.", "name", "category", "brand" ,"topPickToday","topPickWeek","newLaunch","regularPrice","salePrice", "avgRating", "totalRating", "createdAt","status", "action"]

  ngOnInit(): void {
    this.getProduct(this.page, this.limit);
    this.datasource = new MatTableDataSource<any>(this.allProductList);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.sort?.sortChange.subscribe(() => {
      const sortColumn = this.sort.active; // Get active column
      const sortDirection = this.sort.direction; // Get sort direction ('asc' or 'desc')
  
      // Call API with the sorting params
      this.getProduct(this.page, this.limit, this.search, sortColumn, sortDirection);
    });
  }

  getProduct(page: any, limit: any, search: string = '', sortColumn:string= "", sortDirection:string ="") {
    this.isLoading = true;

    this.productService.getList(page, limit, '', search, sortColumn, sortDirection ).subscribe((res: any) => {
      this.isLoading = false;
      this.allProductList = res.data?.product;
      this.datasource = this.allProductList;
      this.totalItems = res.data.count;
    });
  }

  // sortedProductList(page: any, limit: any, search: string = '') {
  //   this.productService.getList(page, limit, '', search).subscribe((res: any) => {
  //     console.log(res, 'res>>>>');
  //     this.datasource = res.data?.product;
  //     this.totalItems = res.data.count;
  //   });
  // }



  onPaginateChange(event: any, value: string): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getProduct(this.page, this.limit)
  }

  // getIndividualHistory(event: any, value: string) {
  //   let page = event.pageIndex + 1;
  //   let limit = event.pageSize;
  //   this.pageIndividual = page;
  //   this.limitIndividual = limit;
  //   this.getPincodelist(this.pageIndividual, this.limitIndividual);
  // }

  redireToProductDetails(id: any) {
    this.router.navigate([`/product-detail/${id}`])
  }

  onCreate(){
    this.router.navigate([`/product/create`])
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.productService.deleteById(id).subscribe((res: any) => {
          this.alertService.success(res.message);
          this.getProduct(this.page, this.limit);          
        });
      }
    });
  }


  onSearch(search: string, type: string): void {
    this.search = search;
   
    this.getProduct(this.page, this.limit, search);
    
  }

  editProduct(id: string) {
    this.router.navigate([`/product/create/product-brand/${id}`]);
  }

  editedElement: { id: string; key: string } | null = null; // Track the editing state

  openInput(element: any, key: string) {
    // Set the currently edited element and field
    this.editedElement = { id: element._id, key };
  }
  
  isEditing(element: any, key: string): boolean {
    // Check if the current cell is being edited
    return this.editedElement?.id === element._id && this.editedElement?.key === key;
  }
  
  setPriority(product: any, event: any, key: string) {

    console.log(event, key, 'setPriority>>>>');

    product.isLoading = true;
  
    this.productService.setProductPriority(product?._id, { rank: event.target.value, keyString: key }).subscribe(
      (res: any) => {
        if (res) {
          product[key] = event.target.value; // Update the specific field
          this.editedElement = null; // Reset editing state
          product.isLoading = false;
          this.alertService.success(res.message);
          this.getProduct(this.page, this.limit);
        }
      },
      (err: any) => {
        product.isLoading = false;
        this.editedElement = null; // Reset editing state on error
        this.alertService.error(err?.error?.message);
      }
    );
  }

  dblclick(event:any, type:string){
    
    console.log("dblclick", event, type)
  }

  viewProduct(id:any){

    console.log('viewProduct', id)
    this.router.navigate([`product-management/product-detail/${id}`]);
  }

  changeProductStatus(product: any, event: any) {
    const isChecked = event.checked;
    product.isActive = isChecked;
    this.productService.changeProductStatus(product._id).subscribe((res: any) => {
      if (res) {
        this.alertService.success(res.message);
      }
    }, (err) => {
      this.alertService.error(err.error.message);
      product.isActive = !isChecked;
    })
  }

  
}
