import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';


interface RentResponseDTO {
  id: number;
  bookId: number;
  memberId: number;
  rentDate: string;
  returnDate?: string | null;
  status: 'WAITING' | 'BORROWED' | 'RETURNED';
}

@Component({
  selector: 'app-book-borrow',
  standalone: true,
  templateUrl: './book-borrow.component.html',
  styleUrl: './book-borrow.component.css',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    NavbarComponent,
  ]
})
export class BookBorrowComponent implements OnInit {
  books: any[] = [];
  page = 0;
  size = 2;
  totalElements = 0;
  isLoading = false;
  form: FormGroup;
  showYearPicker = false;
  years: number[] = [];
  paginationRange: (number | '...')[] = [];
  rents: RentResponseDTO[] = [];


  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: [''],
      author: [''],
      publicationYear: ['']
    });
  }

  ngOnInit(): void {
    this.generateYearList();
    this.form.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.page = 0;
        this.fetchBooks();
      });

    this.fetchBooks();
    this.fetchRentHistory();
  }
  
  generateYearList(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  }
  
  toggleYearPicker(): void {
    this.showYearPicker = !this.showYearPicker;
  }
  
  selectYear(year: number): void {
    this.form.patchValue({ publicationYear: year });
    this.showYearPicker = false;
  }

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.size);
  }

  fetchBooks(): void {
    this.isLoading = true;
    let params = new HttpParams()
      .set('page', this.page)
      .set('size', this.size);

    const { title, author, publicationYear } = this.form.value;

    if (title) params = params.set('title', title);
    if (author) params = params.set('author', author);
    if (publicationYear) params = params.set('publicationYear', publicationYear);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      this.isLoading = false;
      return;
    }    

    this.http.get<any>('http://localhost:8080/v1/books', { params,     headers: {
      Authorization: `Bearer ${token}`,
     },
    }).subscribe({
      next: res => {
        this.books = res.content;
        this.totalElements = res.totalElements;
        this.isLoading = false;
        this.updatePaginationRange();
      },
      error: () => {
        alert('Gagal memuat data buku');
        this.isLoading = false;
      }
    });
  }

  updatePaginationRange(): void {
    const range: (number | "...")[] = [];
    const total = this.totalPages;
  
    if (total <= 7) {
      for (let i = 0; i < total; i++) {
        range.push(i);
      }
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

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.fetchBooks();
    }
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.fetchBooks();
    }
  }

  borrowBook(bookId: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      return;
    }

    let payload;
    try {
      payload = JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      alert('Token tidak valid. Silakan login ulang.');
      return;
    }

    const memberId = payload?.memberId;
    if (!memberId) {
      alert('Member ID tidak ditemukan pada token.');
      return;
    }

    this.http.post<RentResponseDTO>(`http://localhost:8080/v1/rent/${memberId}/${bookId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).subscribe({
      next: (response) => {
        alert(`Buku berhasil dipinjam! ID Peminjaman: ${response.id}`);
        this.fetchBooks();

        this.rents.push({
          id: response.id,
          bookId: bookId,
          memberId: memberId,
          rentDate: response.rentDate,
          returnDate: null,
          status: 'WAITING',
        });
      },
      error: (err) => {
        console.error(err);
        alert('Gagal meminjam buku. Silakan coba lagi.');
      },
    });
  }  

  fetchRentHistory(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      return;
    }

    this.http.get<RentResponseDTO[]>('http://localhost:8080/v1/rent/history', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (response) => {
        this.rents = response;
      },
      error: (err) => {
        console.error(err);
        alert('Gagal memuat riwayat peminjaman.');
      }
    });
  }

  returnBook(rentId: number | null): void {
    if (!rentId) {
      alert('ID peminjaman tidak ditemukan.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      return;
    }

    this.http.post(`http://localhost:8080/v1/rent/return/${rentId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).subscribe({
      next: () => {
        alert('Buku berhasil dikembalikan.');
        this.fetchBooks();
        const rent = this.rents.find(r => r.id === rentId);
        if (rent) {
          rent.status = 'RETURNED';
          rent.returnDate = new Date().toISOString();
        }
      },
      error: (err) => {
        console.error(err);
        alert('Gagal mengembalikan buku. Silakan coba lagi.');
      },
    });
  }

  getBookImage(book: any): string {
    return book.coverImage
      ? `${book.coverImage}`
      : '/assets/default-book.jpg';
  }

  getButtonStatus(bookId: number): { text: string; disabled: boolean; action: 'borrow' | 'return' } {
    const rent = this.rents.find(r => r.bookId === bookId && (r.status === 'WAITING' || r.status === 'BORROWED'));

    if (rent) {
      if (rent.status === 'WAITING') {
        return { text: 'Waiting', disabled: true, action: 'borrow' };
      }
      if (rent.status === 'BORROWED') {
        return { text: 'Return', disabled: false, action: 'return' };
      }
    }

    return { text: 'Pinjam', disabled: false, action: 'borrow' };
  }

  getRentId(bookId: number): number | null {
    const rent = this.rents.find(r => r.bookId === bookId && r.status === 'BORROWED');
    return rent ? rent.id : null;
  }
}
