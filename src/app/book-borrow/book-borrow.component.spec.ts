import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BookBorrowComponent } from './book-borrow.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('BookBorrowComponent', () => {
  let component: BookBorrowComponent;
  let fixture: ComponentFixture<BookBorrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        RouterTestingModule,
        BookBorrowComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookBorrowComponent);
    component = fixture.componentInstance;

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'token') {
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1vY2sgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      }
      return null;
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch books successfully', () => {
    const mockBooks = {
      content: [
        {
          id: 1,
          title: 'Book 1',
          author: 'Author 1',
          publicationYear: 2020,
        },
      ],
      totalElements: 1,
    };

    spyOn(component['http'], 'get').and.returnValue(of(mockBooks));
    component.fetchBooks();
    expect(component.books).toEqual(mockBooks.content);
    expect(component.totalElements).toBe(mockBooks.totalElements);
  });
});
