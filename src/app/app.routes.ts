import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BookBorrowComponent } from './book-borrow/book-borrow.component';
import { BookComponent } from './book/book.component';
import { AuthGuard } from './auth.guard';
import { RentHistoryComponent } from './rent-history/rent-history.component';
import { MemberComponent } from './member/member.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'borrow', component: BookBorrowComponent, canActivate: [AuthGuard], data: { roles: ['MEMBER'] } },
  { path: 'book', component: BookComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'rent-history', component: RentHistoryComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'MEMBER'] } },
  { path: 'members', component: MemberComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } }
];
