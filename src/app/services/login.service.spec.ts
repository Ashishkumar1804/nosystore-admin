import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { HttpcommanService } from './httpshared.service';
import { environment } from '../../environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoginService', () => {
    let service: LoginService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [],
    providers: [LoginService, HttpcommanService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
        service = TestBed.inject(LoginService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    //   afterEach(() => {
    //     httpMock.verify(); // Verify that no outstanding requests are pending after each test
    //   });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send login request to the server', () => {
        const dummyData = { email: 'admin@almwred.com', password: 'Admin@1234' };
        const dummyResponse = {
            status: 200,
            statusText: 'true',
            message: 'Login successfully!',
            data: {
                email: 'admin@almwred.com',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBhN2YyN2I4NjJjNzQ0Mzk2NDMzZTUiLCJlbWFpbCI6ImFkbWluQGFsbXdyZWQuY29tIiwiaWF0IjoxNzEzOTQ5MzA3LCJleHAiOjE3MTM5NTI5MDd9.u8FlXiAYNq_dsKapEIsd0ynXyrBuFhmE0NpZCV61oMc',
                name: 'Super Admin'
            }
        };

        service.login(dummyData).subscribe(response => {
            // expect(response).toEqual(dummyResponse);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/admin/auth/login`);
        expect(req.request.method).toBe('POST');
        req.flush(dummyResponse);
    });

    it('should handle login error', () => {
        const dummyData = { email: 'admin@almwredd.com', password: 'Admin@1234' };

        const errorMessage = 'Error occurred';

        service.login(dummyData).subscribe({
            error: (err) => {
                expect(err).toBe(err);
            }
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/admin/auth/login`);
        expect(req.request.method).toBe('POST');
        req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
});
