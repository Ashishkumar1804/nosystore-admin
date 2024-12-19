import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AlertService } from '../../services/Toaster/alert.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [NgbAccordionModule, CommonModule, RouterModule],
  providers: [{
    provide: ActivatedRoute,
    useValue: {}
  }]
})
export class SidebarComponent implements OnInit {
  isHalfShown = false;
  @Input() toggle = false
  constructor(public dialog: MatDialog,
    private route: Router,
    private alertService: AlertService,
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { width: '250px', disableClose: true });
    dialogRef?.afterClosed()?.subscribe((result) => {
      if (result) {
        sessionStorage.clear();
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.clear();
        localStorage.removeItem('token');
        this.route.navigate(['/login']);
        this.alertService.success('Logout successfully')
      }
    });
  }

  ngOnInit(): void {
    const url = this.route.url;
    if (url.includes('/user') || url.includes('/user-details')) {
      this.renderer.addClass(this.el.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'active');
    }
  }
}
