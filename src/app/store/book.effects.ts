import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BookService } from '../services/book.service';
import { loadBooks, loadBooksSuccess, loadBooksFailure } from './book.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class BookEffects {
  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBooks),
      mergeMap(() =>
        this.bookService.getBooks().pipe(
          map((books) => loadBooksSuccess({ books })),
          catchError((error) => of(loadBooksFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private bookService: BookService) {}
}