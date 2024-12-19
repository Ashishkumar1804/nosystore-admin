// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialog } from '@angular/material/dialog';
// import { RouterTestingModule } from '@angular/router/testing';
// import { SidebarComponent } from './sidebar.component';
// import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
// import { AlertService } from '../../services/Toaster/alert.service';
// import { ToastrModule } from 'ngx-toastr';

// describe('SidebarComponent', () => {
//   let component: SidebarComponent;
//   let fixture: ComponentFixture<SidebarComponent>;
//   let dialogSpy: jasmine.SpyObj<MatDialog>;
//   let alertService: AlertService;

//   beforeEach(async () => {
//     dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
//     await TestBed.configureTestingModule({
//       imports: [RouterTestingModule,ToastrModule.forRoot()],
//       providers: [
//         { provide: MatDialog, useValue: dialogSpy },
//         AlertService
//       ]
//     })
//       .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SidebarComponent);
//     component = fixture.componentInstance;
//     alertService = TestBed.inject(AlertService);
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should open dialog on calling openDialog', () => {
//     component.openDialog();
//     expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, { width: '250px', disableClose: true });
//   });

//   it('should clear session and local storage and navigate to login on confirmation', () => {
//     spyOn(window.sessionStorage, 'clear');
//     spyOn(window.localStorage, 'clear');
//     spyOn(window.localStorage, 'removeItem');
//     spyOn(component['route'], 'navigate');
//     spyOn(alertService, 'success');

//     const result = true; // Simulating dialog confirmation
//     component.openDialog();
//     dialogSpy.open.calls.mostRecent().returnValue?.afterClosed().subscribe((cb: any) => cb(result)); // Explicitly specify the type of cb

//     expect(window.sessionStorage.clear).toHaveBeenCalled();
//     expect(window.localStorage.clear).toHaveBeenCalled();
//     expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
//     expect(component['route'].navigate).toHaveBeenCalledWith(['/login']);
//     expect(alertService.success).toHaveBeenCalledWith('Logout successfully');
//   });

// });
