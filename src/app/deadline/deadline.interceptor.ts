import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockDeadlineInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.endsWith('/api/deadline')) {
      console.log('Mocking deadline API response...');
      return of(new HttpResponse({
        status: 200,
        body: { secondsLeft: 3600 } // 1 hour for testing
      })).pipe(delay(500));
    }
    return next.handle(request);
  }
}
