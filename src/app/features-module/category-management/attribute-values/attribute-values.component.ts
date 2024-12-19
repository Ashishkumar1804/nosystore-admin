import { Component, Input, OnInit, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../services/Toaster/alert.service';
import { CategoryService } from '../category-service/category.service';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

@Component({
  selector: 'app-attribute-values',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatIcon,
    MatToolbar,
    MatToolbarRow,
    MatIcon
  ],
  templateUrl: './attribute-values.component.html',
  styleUrls: ['./attribute-values.component.scss']
})
export class AttributeValuesComponent implements OnInit {
  // @Input() attributeId: string = '';
  attributesValues: any[] = [];
  addingAttributes: any[] = [];
  totalValues = 0;
  columnToDisplay = ['No', 'name', 'Action'];
  page = 1;
  limit = 10;
  sort = '-createdAt';
  search = '';
  sortDir = 'desc';
  isLoading = false;
  data = false;
  isAdding = false;

  @Input() attributeId: string = '';

  @ViewChildren('input') inputs: any;

  searchElement!: HTMLElement;

  CategoryLoadedSub!: Subscription;

  constructor(
    private categoryService: CategoryService,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAttributeValuesList();
    console.log(this.attributeId, 'this.attributeId123>>>>');
  }

  refresh() {
    this.getAttributeValuesList();
  }

  getAttributeValuesList(): void {
    console.log(this.attributeId, 'this.attributeId>>>>');
    this.isLoading = true;
    this.page = this.page || 1;
    this.limit = this.limit || 10;
    this.search = this.search || "";
    this.categoryService
      .attributeValuesList(this.attributeId, this.page, this.limit, this.sort, this.search)
      .subscribe(
        (res: any) => {

          console.log(res, 'attributeValuesList>>>>')
          this.attributesValues = res.data;
          this.totalValues = res.data.length;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  onSearch(search: string): void {
    this.search = search;
    this.getAttributeValuesList();
  }

  pageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getAttributeValuesList();
  }

  sortChange(sort: Sort): void {
    const sortBy = sort.active;
    if (sort.direction === 'asc') {
      this.sort = sortBy;
      this.sortDir = 'asc';
    } else if (sort.direction === 'desc') {
      this.sort = `-${sortBy}`;
      this.sortDir = 'desc';
    } else {
      return;
    }
    this.getAttributeValuesList();
  }

  addAttributeValue() {
    this.isAdding = !this.isAdding;
    if (this.isAdding) {
      this.addingAttributes.unshift({ name: 'new value', isEdit: true });
    } else {
      this.addingAttributes = [];
    }
  }

  editValue(attributeValue: any) {
    attributeValue.isEdit = true;
  }

  updateAttributeValue(attributeValue: any, name: string) {
    attributeValue.isLoading = true;
    console.log(this.attributeId,  attributeValue._id, 'hhhhhhhhhhhhhhhhh')
    if (attributeValue._id) {
      this.categoryService
        .updateAttributeValue(this.attributeId, attributeValue._id, { name })
        .subscribe(
          (res: any) => {
            this.alertService.success(res.message);
            attributeValue.isEdit = false;
            attributeValue.isLoading = false;
          },
          (err) => {
            attributeValue.isEdit = false;
            attributeValue.isLoading = false;
            this.alertService.warning(err.message);
          }
        );
    } else {
      this.categoryService.addAttributeValue(this.attributeId, { name }).subscribe(
        (res: any) => {
          this.alertService.success(res.message);
          attributeValue.isEdit = false;
          attributeValue.isLoading = false;
          this.isAdding = false;
          this.getAttributeValuesList();
        },
        (err) => {
          attributeValue.isEdit = false;
          attributeValue.isLoading = false;
          this.alertService.warning(err.message);
          this.isAdding = false;
        }
      );
    }
  }
}
