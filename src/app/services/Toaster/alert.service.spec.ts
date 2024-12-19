import { TestBed } from '@angular/core/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;
  let toastrService: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      providers: [AlertService, ToastrService]
    });
    service = TestBed.inject(AlertService);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call toastr success method with correct parameters', () => {
    spyOn(toastrService, 'success');
    const message = 'Test success message';
    service.success(message);
    expect(toastrService.success).toHaveBeenCalledWith(message, 'Success!',
      jasmine.objectContaining({
        closeButton: true,
        positionClass: 'toast-bottom-center',
        progressBar: true,
        progressAnimation: 'increasing',
        timeOut: 1500
      }));
  });

  it('should call toastr error method with correct parameters', () => {
    spyOn(toastrService, 'error');
    const message = 'Test error message';
    service.error(message);
    expect(toastrService.error).toHaveBeenCalledWith(message, 'Error!',
      jasmine.objectContaining({
        closeButton: true,
        positionClass: 'toast-bottom-center',
        progressBar: true,
        progressAnimation: 'increasing',
        timeOut: 1500
      }));
  });

  it('should call toastr warning method with correct parameters', () => {
    spyOn(toastrService, 'warning');
    const message = 'Test warning message';
    service.warning(message);
    expect(toastrService.warning).toHaveBeenCalledWith(message, 'Warning!',
      jasmine.objectContaining({
        closeButton: true,
        positionClass: 'toast-bottom-center',
        progressBar: true,
        progressAnimation: 'increasing',
        timeOut: 1500
      }));
  });

  it('should call toastr info method with correct parameters', () => {
    spyOn(toastrService, 'info');
    const message = 'Test info message';
    service.info(message);
    expect(toastrService.info).toHaveBeenCalledWith(message, 'info!',
      jasmine.objectContaining({
        closeButton: true,
        positionClass: 'toast-bottom-center',
        progressBar: true,
        progressAnimation: 'increasing',
        timeOut: 1500
      }));
  });
});
