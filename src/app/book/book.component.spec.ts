import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { BookComponent } from './book.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        ReactiveFormsModule,
        MatDialogModule,
        RouterTestingModule,
        BookComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch books successfully', () => {
    const mockBooks = {
      content: [
        { id: 1, title: 'Book 1', author: 'Author 1', publicationYear: 2020 },
      ],
      totalElements: 1,
    };
    spyOn(component['bookService'], 'getBooks').and.returnValue(of(mockBooks));
    component.fetchBooks();
    expect(component.books.data).toEqual(mockBooks.content);
    expect(component.totalElements).toBe(mockBooks.totalElements);
  });

  it('should open the dialog for adding a book', () => {
    spyOn(component['dialog'], 'open').and.callThrough();
    component.openDialog();
    expect(component['dialog'].open).toHaveBeenCalled();
  });
});
