  import { Inject, Injectable } from '@angular/core';
  import { ToastrService } from 'ngx-toastr';

  @Injectable({
    providedIn: 'root'
  })
  export class AlertService {



    constructor(private toast: ToastrService) { }


    success(message: string) {
      this.toast.success(message, 'Success!',
        {
          closeButton: true,
          positionClass: 'toast-bottom-center',
          progressBar: true,
          progressAnimation: 'increasing', timeOut: 1500
        });
    }

    error(message: string) {
      this.toast.error(message, 'Error!',
        {
          closeButton: true,
          positionClass: 'toast-bottom-center',
          progressBar: true,
          progressAnimation: 'increasing', timeOut: 1500
        });
    }

    warning(message: string) {
      this.toast.warning(message, 'Warning!',
        {
          closeButton: true,
          positionClass: 'toast-bottom-center',
          progressBar: true,
          progressAnimation: 'increasing', timeOut: 1500
        });
    }

    info(message: string) {
      this.toast.info(message, 'info!',
        {
          closeButton: true,
          positionClass: 'toast-bottom-center',
          progressBar: true,
          progressAnimation: 'increasing', timeOut: 1500
        });
    }


  }
