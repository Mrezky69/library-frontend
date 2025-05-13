import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { BookService } from '../services/book.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-book',
  standalone: true,
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarComponent
  ],
})
export class BookComponent implements OnInit {
  books: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['coverImage', 'title', 'author', 'publicationYear', 'stock', 'action'];

  filters: { [key: string]: string } = {
    title: '',
    author: '',
    publicationYear: ''
  };  
  years: number[] = [];
  showYearPicker = false;
  isLoading = false;

  page = 0;
  size = 2;
  totalElements = 0;
  paginationRange: (number | '...')[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private bookService = inject(BookService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.generateYearList();
    this.fetchBooks();
  }

  generateYearList(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  }

  toggleYearPicker(): void {
    this.showYearPicker = !this.showYearPicker;
  }

  selectYear(year: number): void {
    this.filters['publicationYear'] = year.toString();
    this.showYearPicker = false;
    this.page = 0;
    this.fetchBooks();
  }  

  onFilterChange(event: any, key: string): void {
    this.filters[key] = event.target.value;
    this.page = 0;
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.isLoading = true;
    const params = {
      ...this.filters,
      page: this.page,
      size: this.size,
    };

    this.bookService.getBooks(params).subscribe({
      next: res => {
        this.books = new MatTableDataSource(res.content);
        this.books.paginator = this.paginator;
        this.totalElements = res.totalElements;
        this.updatePaginationRange();
        this.isLoading = false;
      },
      error: () => {
        alert('Gagal mengambil data');
        this.isLoading = false;
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.size);
  }

  updatePaginationRange(): void {
    const range: (number | "...")[] = [];
    const total = this.totalPages;

    if (total <= 7) {
      for (let i = 0; i < total; i++) range.push(i);
    } else {
      if (this.page <= 3) {
        range.push(0, 1, 2, 3, 4, "...", total - 1);
      } else if (this.page >= total - 4) {
        range.push(0, "...", total - 5, total - 4, total - 3, total - 2, total - 1);
      } else {
        range.push(0, "...", this.page - 1, this.page, this.page + 1, "...", total - 1);
      }
    }

    this.paginationRange = range;
  }

  goToPage(index: number): void {
    if (typeof index !== 'number' || index < 0 || index >= this.totalPages || index === this.page) return;
    this.page = index;
    this.fetchBooks();
  }

  deleteBook(id: number): void {
    if (confirm('Yakin ingin menghapus buku ini?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.fetchBooks(),
        error: () => alert('Gagal menghapus buku')
      });
    }
  }

  openDialog(data: any = null): void {
    const ref = this.dialog.open(BookDialogComponent, {
      width: '2500px',
      data
    });

    ref.afterClosed().subscribe(result => {
      if (result === 'refresh') this.fetchBooks();
    });
  }

  getBookImage(book: any): string {
    return book.coverImage
      ? `${book.coverImage}`
      : '/assets/default-book.jpg';
  }
}
