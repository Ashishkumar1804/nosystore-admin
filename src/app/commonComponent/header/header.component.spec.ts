import { HeaderComponent } from './header.component';
import { EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;

  beforeEach(() => {
    modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    component = new HeaderComponent(modalServiceSpy);
  });

  it('should initialize with correct initial values', () => {
    expect(component.isHalfShown).toBeFalse();
  });

  it('should emit correct data when toggleSidebar is called', () => {
    let emittedValue: boolean | undefined;
    component.dataEvent.subscribe((data: boolean) => {
      emittedValue = data;
    });

    component.toggleSidebar();

    expect(emittedValue).toBeTrue();
  });

  it('should call modalService.open when open is called', () => {
    const mockModalRef: NgbModalRef = { result: Promise.resolve('result') } as NgbModalRef;
    modalServiceSpy.open.and.returnValue(mockModalRef);

    const mockTemplateRef: TemplateRef<any> = {} as TemplateRef<any>;
    component.open(mockTemplateRef);

    expect(modalServiceSpy.open).toHaveBeenCalledWith(mockTemplateRef, { ariaLabelledBy: 'modal-basic-title' });

    // Test the result handlers if needed
  });

  // Add more test cases as needed
});
