
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerpSearch(arr: number[], val: number): number {
  const len = arr.length;
  const last = len - 1;

  // Return NaN if the value cannot be found meaningfully at all in the array.
  if (len === 0 || isNaN(val)) {
    return NaN;
  }

  // If the array is only one element long, three cases.
  if (last === 0) {
    if (val === arr[0]) {
      return 0;
    } else if (val < arr[0]) {
      return -Infinity;
    } else {
      return Infinity;
    }
  }

  // We now know the array has at least two elements. See if we can extrapolate
  // past the ends.
  if (val < arr[0]) {
    return (val - arr[0]) / (arr[1] - arr[0]);
  } else if (val > arr[last]) {
    return last + (val - arr[last]) / (arr[last] - arr[last - 1]);
  }

  // The value is somewhere in range. Perform binary search with lerping.
  let lo = 0;
  let hi = last;
  while (true) {
    if (hi === lo + 1) {
      return lo + (val - arr[lo]) / (arr[hi] - arr[lo]);
    }
    const mid = Math.floor((lo + hi) / 2);
    const cmp = arr[mid];
    if (val === cmp) {
      return mid;
    } else if (val < cmp) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
}

export function lerpLookup(arr: number[], i: number): number {
  if (arr.length === 0 || isNaN(i)) {
    return NaN;
  }

  // If the array is only one element long, use that as a constant.
  if (arr.length === 1) {
    return arr[0];
  }

  if (i < 0) {
    return arr[0] + i * (arr[1] - arr[0]);
  }
  const last = arr.length - 1;
  if (i > last) {
    return arr[last] + (i - last) * (arr[last] - arr[last - 1]);
  }
  const floor = Math.floor(i);
  const ceil = Math.ceil(i);
  const a = arr[floor];
  const b = arr[ceil];
  const t = i - floor;
  return lerp(a, b, t);
}

