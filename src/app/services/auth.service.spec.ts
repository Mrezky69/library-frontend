import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send login request', () => {
    const credentials = { email: 'test@example.com', password: '123456' };
    const mockResponse = { token: 'abc', refreshToken: 'xyz' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/v1/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should send register request', () => {
    const data = { name: 'John', email: 'john@example.com', password: '123' };
    service.register(data).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/v1/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({});
  });

  it('should send refresh token request', () => {
    const payload = { token: 'refresh-token' };
    service.refresh(payload).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/v1/refresh');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('should get user profile with token', () => {
    localStorage.setItem('token', 'valid-token');
    service.getProfile().subscribe();

    const req = httpMock.expectOne('http://localhost:8080/v1/me');
    expect(req.request.headers.get('Authorization')).toBe('Bearer valid-token');
    req.flush({});
  });

  it('should save and retrieve token from localStorage', () => {
    service.saveToken('access-token', 'refresh-token');
    expect(service.getToken()).toBe('access-token');
  });

  it('should clear token and navigate to login on logout', () => {
    localStorage.setItem('token', 'abc');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return true if token exists', () => {
    localStorage.setItem('token', 'abc');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false if token does not exist', () => {
    localStorage.removeItem('token');
    expect(service.isAuthenticated()).toBeFalse();
  });
});
