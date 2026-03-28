import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeadlineService } from './deadline.service';
import { Observable, timer, map, switchMap, takeWhile, catchError, of } from 'rxjs';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountdownComponent {
  private readonly deadlineService = inject(DeadlineService);

  /**
   * countdown$ creates an observable
   */
  public readonly countdown$: Observable<number> = this.deadlineService.getDeadlineSeconds().pipe(
    switchMap((initialSeconds) => {
      return timer(0, 1000).pipe(
        map((elapsed) => Math.max(0, initialSeconds - elapsed)),
        takeWhile((remaining) => remaining >= 0, true) 
      );
    }),
    catchError((err) => {
      console.error('Countdown stream error:', err);
      return of(0);
    })
  );
}
