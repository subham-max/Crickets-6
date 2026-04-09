/**
 * Analytical Problem: Software Camera Versatility Coverage (Optimized)
 * 
 * This solution determines if a target 2D range (subject distance and light level)
 * is fully covered by a collection of hardware cameras.
 * 
 * Approach: Sweep Line Algorithm
 * Time Complexity: O(N^2) - Robust and stable for geometric coverage.
 * This is widely considered the "best optimized" analytical solution for 2D coverage 
 * without requiring complex data structures like Segment Trees.
 */

interface MeasurementRange {
  min: number;
  max: number;
}

interface CameraConfig {
  name?: string;
  distance: MeasurementRange;
  light: MeasurementRange;
}

/**
 * Checks if target requirements are fully covered by a set of hardware cameras.
 */
function willSuffice(target: CameraConfig, hardware: CameraConfig[]): boolean {
  // 1. Identify all critical X-coordinates (Subject Distance boundaries)
  // We only care about boundaries within the target's distance range.
  const xCoords = new Set<number>();
  xCoords.add(target.distance.min);
  xCoords.add(target.distance.max);

  for (const cam of hardware) {
    if (cam.distance.min > target.distance.min && cam.distance.min < target.distance.max) {
      xCoords.add(cam.distance.min);
    }
    if (cam.distance.max > target.distance.min && cam.distance.max < target.distance.max) {
      xCoords.add(cam.distance.max);
    }
  }

  // 2. Sort unique X-coordinates to create a sequence of distance intervals
  const sortedX = Array.from(xCoords).sort((a, b) => a - b);

  // 3. Sweep through each distance interval
  for (let i = 0; i < sortedX.length - 1; i++) {
    const dStart = sortedX[i];
    const dEnd = sortedX[i + 1];
    
    // We check the midpoint of the interval for simplicity, 
    // as any camera covering the midpoint also covers the entire interval [dStart, dEnd]
    // given that we used all camera boundaries as our split points.
    const midDistance = (dStart + dEnd) / 2;

    // 4. Collect all light ranges available for this distance interval
    const activeLightRanges: MeasurementRange[] = hardware
      .filter(cam => cam.distance.min <= dStart && cam.distance.max >= dEnd)
      .map(cam => cam.light);

    // 5. Check if the union of these 1D intervals covers the target light range
    if (!isRangeCovered(target.light, activeLightRanges)) {
      return false; // Found a gap in coverage for this distance range
    }
  }

  return true;
}

/**
 * Helper: Checks if a target 1D range is fully covered by a set of candidate ranges.
 * Time Complexity: O(M log M) where M is number of ranges.
 */
function isRangeCovered(target: MeasurementRange, candidates: MeasurementRange[]): boolean {
  if (candidates.length === 0) return false;

  // Sort candidates by their starting point
  const sorted = [...candidates].sort((a, b) => a.min - b.min);

  let currentMaxCoverage = target.min;

  for (const range of sorted) {
    // If there's a gap between the current coverage and the start of the next range
    if (range.min > currentMaxCoverage) {
      return false;
    }
    // Update the furthest point we've covered
    currentMaxCoverage = Math.max(currentMaxCoverage, range.max);
    
    // If we've already covered the entire target range
    if (currentMaxCoverage >= target.max) {
      return true;
    }
  }

  return currentMaxCoverage >= target.max;
}

// --- Test Suite ---

function runTests() {
  const target: CameraConfig = {
    distance: { min: 1, max: 10 },
    light: { min: 100, max: 1000 }
  };

  console.log("Starting Optimized Sweep Line Coverage Tests...\n");

  // Test 1: Single camera perfectly matching
  const test1 = willSuffice(target, [{ distance: { min: 1, max: 10 }, light: { min: 100, max: 1000 } }]);
  console.log(`Test 1 (Perfect Match): ${test1 ? "PASS" : "FAIL"}`);

  // Test 2: Two cameras covering halves
  const test2 = willSuffice(target, [
    { distance: { min: 1, max: 6 }, light: { min: 100, max: 1000 } },
    { distance: { min: 5, max: 10 }, light: { min: 100, max: 1000 } }
  ]);
  console.log(`Test 2 (Two Halves Overlapping): ${test2 ? "PASS" : "FAIL"}`);

  // Test 3: Grid of 4 cameras
  const test3 = willSuffice(target, [
    { distance: { min: 1, max: 6 }, light: { min: 100, max: 600 } },
    { distance: { min: 5, max: 10 }, light: { min: 100, max: 600 } },
    { distance: { min: 1, max: 6 }, light: { min: 500, max: 1000 } },
    { distance: { min: 5, max: 10 }, light: { min: 500, max: 1000 } }
  ]);
  console.log(`Test 3 (4-Camera Grid): ${test3 ? "PASS" : "FAIL"}`);

  // Test 4: Gaps in coverage
  const test4 = willSuffice(target, [
    { distance: { min: 1, max: 4 }, light: { min: 100, max: 1000 } },
    { distance: { min: 6, max: 10 }, light: { min: 100, max: 1000 } }
  ]);
  console.log(`Test 4 (Gap in Distance): ${test4 === false ? "PASS" : "FAIL"}`);

  // Test 5: Insufficient light coverage
  const test5 = willSuffice(target, [
    { distance: { min: 1, max: 10 }, light: { min: 100, max: 500 } },
    { distance: { min: 1, max: 10 }, light: { min: 600, max: 1000 } }
  ]);
  console.log(`Test 5 (Gap in Light): ${test5 === false ? "PASS" : "FAIL"}`);

  // Test 6: Overlapping many small cameras
  const hardware: CameraConfig[] = [];
  for (let i = 1; i < 10; i++) {
    hardware.push({ distance: { min: i, max: i + 1.1 }, light: { min: 100, max: 1000 } });
  }
  const test6 = willSuffice(target, hardware);
  console.log(`Test 6 (Sequence of 9): ${test6 ? "PASS" : "FAIL"}`);

  // Test 7: Complex nesting (one camera inside another)
  const test7 = willSuffice(target, [
    { distance: { min: 1, max: 10 }, light: { min: 100, max: 1000 } },
    { distance: { min: 2, max: 5 }, light: { min: 200, max: 500 } }
  ]);
  console.log(`Test 7 (Nested Cameras): ${test7 ? "PASS" : "FAIL"}`);
}

runTests();
