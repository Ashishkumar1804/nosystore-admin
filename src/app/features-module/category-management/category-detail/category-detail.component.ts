
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DataService } from '../../../services/data.service';
import { AlertService } from '../../../services/Toaster/alert.service';
import { CategoryService } from '../category-service/category.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddAttributeComponent } from '../add-attribute/add-attribute.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { AttributeDetailsComponent } from '../attribute-details/attribute-details.component';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTableModule
  ],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  categoryId: string = '';
  // baseUrl = environment.baseUrl;

  category: any;
  isLoading = false;
  isEditActive = true;
  isAddActive = false;
  returnPolicy: any;

  attributes: any[] = [];
  childCategories: any = [];

  columnToDisplay = ['No', 'name', 'Thumbnail Image', 'Status', 'Action'];
  // attrColumnToDisplay = ['No', 'name', 'attributeType', 'addAccess', 'useForVariants', 'action'];
  attrColumnToDisplay = ['No', 'name', 'attributeType', 'action'];

  breadCrumb: any[] = [];

  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.dataService.headerData.next({ isHandset: false, headerText: 'Category details' });
    this.activatedRoute.params.subscribe((res: any) => {
      this.categoryId = res.id;
      this.getCategoryDetails();
      this.getReturnPolicy();
    });
  }

  private getCategoryDetails(): void {
    this.isLoading = true;
    this.categoryService.getCategoryDetails(this.categoryId).subscribe((res: any) => {
      console.log(res, 'res>>>');
      this.category = res.data;
      this.isLoading = false;
      this.childCategories = this.category?.childCategories || [];
      this.attributes = this.category?.attributesList || [];
      this.breadCrumb = this.category.breadCrumb;
    }, err => {
      this.isLoading = false;
      // this.router.navigateByUrl(CATEGORY_LIST_ROUTE.url);
    });
  }

  categoryDetails(_id: string) {
    // this.router.navigateByUrl(`${CATEGORY_DETAIL_ROUTE.url}/${_id}`);
  }

  onBreadCrumbClick(id: string) {
    this.categoryDetails(id);
  }

  onCategoriesClick() {
    // this.router.navigateByUrl(CATEGORY_LIST_ROUTE.url);
  }

  addReturnPolicy(type: any, data: any, category: any) {
    // const dialogRef = this.dialog.open(AddComponent, {
    //   data: { type: type, data: data, category: category },
    //   height: 'fit-content',
    //   maxHeight: '90vh',
    // });
    // dialogRef.afterClosed().subscribe((res: any) => {
    //   if (res) {
    //   }
    // });
  }

  addCategory() {
    // const dialogRef = this.dialog.open(AddCategoryComponent, {
    //   height: 'auto',
    //   width: '30%',
    //   minWidth: '300px',
    //   data: {
    //     addFromDetails: true,
    //     categoryId: this.categoryId
    //   }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     const categories = [result];
    //     if (!this.childCategories?.length) {
    //       this.getCategoryDetails();
    //     }
    //     categories.push(...this.childCategories);
    //     this.childCategories = categories;
    //   }
    // });
  }

  editCategory(data: any) {
    // const dialogRef = this.dialog.open(AddCategoryComponent, {
    //   height: 'auto',
    //   width: '30%',
    //   minWidth: '300px',
    //   data: data
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     data.name = result.name;
    //     data.image = result.image;
    //     data.slug = result.slug;
    //   }
    // });
  }

  changeStatus(id: any) {
    // this.categoryService.changeCategoryStatus(id).subscribe((res: any) => {
    //   if (res) {
    //     this.alert.success(res.message);
    //   }
    // }, (err) => {
    //   console.log(err.message);
    // });
  }

  editAttribute(attribute: any): void {
    console.log(attribute, 'editAttribute>>>')
    this.openAttributeDialog(attribute);
  }

  private openAttributeDialog(attribute: any = null) {
    const dialogRef = this.dialog.open(AddAttributeComponent, {
      data: { category: this.category, attribute },
      width: '70rem',
      height: 'fit-content',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (attribute && res) {
        attribute.name = res.name;
        attribute.attributeType = res.attributeType;
        attribute.addAccess = res.addAccess;
        attribute.useForVariants = res.useForVariants;
        attribute.isProperties = res.isProperties;
      }
      if (!attribute && res) {
        const attributes = [res];
        if (!this.attributes?.length) {
          this.getCategoryDetails();
        }
        attributes.push(...this.attributes);
        this.attributes = attributes;
      }
    });
  }

  addAttributes(): void {
    this.openAttributeDialog();
  }

  attributeDetails(attributeId: string): void {
    console.log('attributeDetails');
    this.dialog.open(AttributeDetailsComponent, {
      width: '60rem',
      height: '90vh',
      data: { attributeId, categoryData: { name: this.category.name } }
    });
  }
  getReturnPolicy() {
  //   this.categoryService.getReturnPolicy(this.categoryId).subscribe(res => {
  //     this.returnPolicy = res.data.returnPolicy;
  //     if (!this.returnPolicy) {
  //       this.isEditActive = false;
  //       this.isAddActive = true;
  //     }
  //   }, err => {});
  }
}
