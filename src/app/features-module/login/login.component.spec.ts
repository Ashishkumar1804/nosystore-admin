import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../../services/login.service';
import { AlertService } from '../../services/Toaster/alert.service';
import { of } from 'rxjs';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const loginServiceSpyObj = jasmine.createSpyObj('LoginService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const alertServiceSpyObj = jasmine.createSpyObj('AlertService', ['success']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: LoginService, useValue: loginServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: AlertService, useValue: alertServiceSpyObj },
        FormBuilder,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    httpMock = TestBed.inject(HttpTestingController);
    formBuilder = TestBed.inject(FormBuilder);
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
  });



  afterEach(() => {
    httpMock.verify(); // Verify that there are no outstanding requests
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should build the form correctly', () => {
    component.buildForm();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  // it('should submit login form successfully', fakeAsync(() => {
  //   const mockResponse = { status: 200, data: { token: 'mock-token' } };
  //   loginServiceSpy.login.and.returnValue(of(mockResponse));

  //   component.buildForm();
  //   component.loginForm.patchValue({
  //     email: 'admin@almwredd.com',
  //     password: 'Admin@1234',
  //   });
  //   component.login();
  //   tick();

  //   expect(loginServiceSpy.login).toHaveBeenCalled();
  //   expect(localStorage.getItem('isLoggedIn')).toBe('true');
  //   expect(localStorage.getItem('token')).toBe('mock-token');
  //   expect(alertServiceSpy.success).toHaveBeenCalledWith('Login successfully');
  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  // }));
});
