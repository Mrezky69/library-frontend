import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';

export interface RentResponseDTO {
  id: number;
  bookId: number;
  memberId: number;
  rentDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: 'WAITING' | 'BORROWED' | 'RETURNED';
  bookTitle: string;
}

@Component({
  selector: 'app-rent-history',
  standalone: true,
  templateUrl: './rent-history.component.html',
  styleUrls: ['./rent-history.component.css'],
  imports: [CommonModule, MatTableModule, MatButtonModule, NavbarComponent],
})
export class RentHistoryComponent implements OnInit {
  rentHistory: RentResponseDTO[] = [];
  rents: RentResponseDTO[] = [];
  displayedColumns: string[] = ['id', 'bookTitle', 'rentDate', 'dueDate', 'returnDate', 'status', 'action'];
  isAdmin = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRentHistory();
  }

  fetchRentHistory(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      return;
    }

    this.http.get<RentResponseDTO[]>('http://localhost:8080/v1/rent/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).subscribe({
      next: (response) => {
        this.rents = response;

        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isAdmin = payload?.role === 'ADMIN';

        this.displayedColumns = this.isAdmin
          ? ['id', 'bookTitle', 'memberId', 'rentDate', 'dueDate', 'returnDate', 'status', 'action']
          : ['id', 'bookTitle', 'rentDate', 'dueDate', 'returnDate', 'status'];
      },
      error: (err) => {
        console.error(err);
        alert('Gagal memuat riwayat peminjaman.');
      },
    });
  }

  approveRent(rentId: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      return;
    }

    this.http.post(`http://localhost:8080/v1/rent/approve/${rentId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).subscribe({
      next: () => {
        alert('Peminjaman berhasil disetujui.');
        this.fetchRentHistory();
      },
      error: (err) => {
        console.error(err);
        alert('Gagal menyetujui peminjaman.');
      },
    });
  }
}
