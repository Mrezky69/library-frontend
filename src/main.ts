import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { reducers } from './app/store';
import { BookEffects } from './app/store/book.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore(reducers),
    provideEffects([BookEffects]),
    appConfig,
  ],
});
