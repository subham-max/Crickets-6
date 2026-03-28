import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';


export interface DeadlineResponse {
  secondsLeft: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeadlineService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/deadline';

 
  getDeadlineSeconds(): Observable<number> {
    return this.http.get<DeadlineResponse>(this.apiUrl).pipe(
      map((response) => response.secondsLeft),
      catchError((error) => {
        console.error('Error fetching deadline from server:', error);
        // Fallback to 0 to prevent issues with countdown logic
        return of(0);
      })
    );
  }
}
