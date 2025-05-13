import { ActionReducerMap } from '@ngrx/store';
import { bookReducer, BookState } from './book.reducer';

export interface AppState {
  books: BookState;
}

export const reducers: ActionReducerMap<AppState> = {
  books: bookReducer,
};