import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface MemberResponseDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-member',
  standalone: true,
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    NavbarComponent,
    MatProgressSpinnerModule,
  ],
})
export class MemberComponent implements OnInit {
  members: MemberResponseDTO[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMembers();
  }

  fetchMembers(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      return;
    }

    this.http.get<MemberResponseDTO[]>('http://localhost:8080/v1/members', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).subscribe({
      next: (response) => {
        this.members = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Gagal memuat data member.');
        this.isLoading = false;
      },
    });
  }

  deleteMember(memberId: number): void {
    if (!confirm('Apakah Anda yakin ingin menghapus member ini?')) {
      return;
    }

    this.http.delete(`http://localhost:8080/v1/members/${memberId}`).subscribe({
      next: () => {
        alert('Member berhasil dihapus.');
        this.fetchMembers();
      },
      error: (err) => {
        console.error(err);
        alert('Gagal menghapus member.');
      },
    });
  }
}
