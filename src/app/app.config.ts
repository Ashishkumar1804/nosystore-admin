import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(),
  provideAnimationsAsync(),
  provideToastr(),
  provideHttpClient(withInterceptorsFromDi()),
  {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  {
    provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true
  },

  ],
};
