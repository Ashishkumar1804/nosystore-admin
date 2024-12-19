import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription, debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('search') searchElement: any;
  search!: string;
  @Input() searchPlaceholder!: string;
  @Output() onSearch: EventEmitter<string> = new EventEmitter();
  searchSubs!: Subscription;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.startSearch();
  }

  private startSearch(): void {
    // this.searchElement = document.getElementById('search');
    this.searchSubs = fromEvent<any>(this.searchElement.nativeElement, 'input').pipe(
      debounceTime(500),
    ).subscribe(event => {
      this.search = event.target.value;
      if (this.search && this.search?.trim()) {
        this.onSearch.emit(this.search);
      }
      if (!this.search) {
        this.onSearch.emit(this.search);
      }
    });
  }


  ngOnDestroy(): void {
    if (this.searchSubs) {
      this.searchSubs.unsubscribe();
    }
  }
}
