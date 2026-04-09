import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeadlineService } from './deadline.service';
import { Observable, timer, map, switchMap, takeWhile, catchError, of, distinctUntilChanged } from 'rxjs';

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
   * countdown$ creates an optimized, drift-free stream of seconds left.
   * 1. Fetches initial seconds from service.
   * 2. Calculates absolute target timestamp.
   * 3. Ticks every second, calculating the difference from now.
   * 4. Uses distinctUntilChanged to ensure change detection only fires when the integer second changes.
   */
  public readonly countdown$: Observable<number> = this.deadlineService.getDeadlineSeconds().pipe(
    switchMap((initialSeconds) => {
      // Calculate the absolute target time once to avoid drift
      const targetTime = Date.now() + initialSeconds * 1000;

      return timer(0, 1000).pipe(
        map(() => Math.round((targetTime - Date.now()) / 1000)),
        map((seconds) => Math.max(0, seconds)), // Never go below 0
        distinctUntilChanged(), // Only emit if the integer second actually changes
        takeWhile((remaining) => remaining >= 0, true)
      );
    }),
    catchError((err) => {
      console.error('Countdown stream error:', err);
      return of(0);
    })
  );
}
