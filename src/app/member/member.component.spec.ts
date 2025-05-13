import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { MemberComponent } from './member.component';
import { of } from 'rxjs';

describe('MemberComponent', () => {
  let component: MemberComponent;
  let fixture: ComponentFixture<MemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        RouterTestingModule,
        MemberComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberComponent);
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

  it('should fetch members successfully', () => {
    const mockMembers = [
      { id: 1, name: 'Member 1', email: 'member1@mail.com', phone: '1234567890', address: '123 Main St' },
    ];

    spyOn(component['http'], 'get').and.returnValue(of(mockMembers));
    component.fetchMembers();
    expect(component.members).toEqual(mockMembers);
  });
});
