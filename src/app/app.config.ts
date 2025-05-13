import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig = [
  provideRouter(routes),
  provideHttpClient()
];
