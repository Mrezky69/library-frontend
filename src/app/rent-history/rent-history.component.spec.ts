import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { RentHistoryComponent, RentResponseDTO } from './rent-history.component';
import { of } from 'rxjs';

describe('RentHistoryComponent', () => {
  let component: RentHistoryComponent;
  let fixture: ComponentFixture<RentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        RouterTestingModule,
        RentHistoryComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RentHistoryComponent);
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

  it('should fetch rent history successfully', () => {
    const mockHistory: RentResponseDTO[] = [
      {
        id: 1,
        bookId: 101,
        memberId: 201,
        rentDate: '2023-01-01',
        dueDate: '2023-01-15',
        returnDate: null,
        status: 'BORROWED',
        bookTitle: 'Book1',
      },
    ];

    spyOn(component['http'], 'get').and.returnValue(of(mockHistory));

    component.fetchRentHistory();

    expect(component.rents).toEqual(mockHistory);
  });
});
