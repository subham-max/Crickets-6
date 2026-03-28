# Countdown Timer Solution README

This document explains the technical implementation of the high-performance Angular countdown component.

## Core Implementation Details

### 1. Performance Optimized RxJS Logic
The countdown is handled entirely with RxJS observables, which is more predictable and efficient than `setInterval`:
- **`timer(0, 1000)`**: Starts immediately and emits every second.
- **`switchMap`**: Ensures that every time a new deadline value is fetched, the old timer is discarded and a new one starts.
- **`takeWhile`**: Automatically completes the stream when the countdown reaches 0, preventing unnecessary processing.

### 2. Angular Best Practices
- **`ChangeDetectionStrategy.OnPush`**: The component only checks for changes when its observable emits a new value. This significantly reduces the workload on the Angular change detector.
- **Standalone Component**: The component is self-contained and avoids the overhead of unnecessary `NgModules` where possible (though integrated into `AppModule` for the root project).
- **Async Pipe**: The template uses the `| async` pipe to subscribe to the countdown stream. This is the **most optimized way** to handle observables in Angular because it automatically manages subscription and unsubscription, preventing memory leaks.

### 3. Backend Integration & Testing
- **`HttpClient`**: Uses Angular's standard HTTP client for server communication.
- **Mock Interceptor**: For verification purposes, an `HttpInterceptor` was added to simulate the `/api/deadline` response, providing a stable 1-hour deadline for testing without a live backend.

---

## Tool & Version Information

Based on the `package.json` in your project, the following versions were used for this implementation:

| Tool | Version |
| :--- | :--- |
| **Angular** | `15.2.0` |
| **RxJS** | `~7.8.0` |
| **TypeScript** | `~4.9.4` |
| **Node.js** | (Compatible with Angular 15, e.g., 16/18 LTS) |

---

## How it works (Copy/Paste Friendly)

1.  **Service**: `DeadlineService` fetches the total `secondsLeft` from the API.
2.  **Component**: `CountdownComponent` starts a local timer. It calculates `Math.max(0, initialSeconds - elapsed)` to ensure it never goes below zero.
3.  **Template**: Displays the remaining value directly using the `async` pipe.
