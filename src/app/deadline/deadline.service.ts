import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';

export interface DeadlineResponse {
  secondsLeft: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeadlineService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/deadline';

  /**
   * Fetches the deadline and caches the result. 
   * shareReplay(1) ensures that if multiple components subscribe, 
   * only one HTTP call is made.
   */
  private readonly deadline$ = this.http.get<DeadlineResponse>(this.apiUrl).pipe(
    map((response) => response.secondsLeft),
    catchError((error) => {
      console.error('Error fetching deadline from server:', error);
      return of(0);
    }),
    shareReplay(1)
  );

  getDeadlineSeconds(): Observable<number> {
    return this.deadline$;
  }
}
