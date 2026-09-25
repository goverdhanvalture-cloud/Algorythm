// Pure Binary Search step generator. Assumes a sorted array (caller validates).
export function binarySearchSteps(input, target) {
  const a = [...input];
  const steps = [];

  const push = (s) =>
    steps.push({
      id: steps.length,
      array: [...a],
      target,
      low: s.low == null ? -1 : s.low,
      high: s.high == null ? -1 : s.high,
      mid: s.mid == null ? -1 : s.mid,
      foundIndex: s.foundIndex == null ? -1 : s.foundIndex,
      eliminated: s.eliminated ? [...s.eliminated] : [],
      type: s.type,
      what: s.what,
      why: s.why,
      trace: s.trace || {},
    });

  if (a.length === 0) {
    push({
      type: 'notFound',
      what: 'The array is empty — there is nothing to search.',
      why: 'Binary Search needs at least one element.',
      trace: { target },
    });
    return steps;
  }

  let low = 0;
  let high = a.length - 1;
  const eliminated = new Set();

  push({
    type: 'start',
    low,
    high,
    what: `Searching for ${target} in a sorted array of ${a.length} elements.`,
    why: 'Binary Search halves the range each step, which only works on sorted data.',
    trace: { low, high, target },
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    push({
      type: 'select',
      low,
      high,
      mid,
      eliminated,
      what: `Inspect the middle element at index ${mid} (value ${a[mid]}).`,
      why: 'We always check the middle so one comparison can discard half the remaining range.',
      trace: { low, high, mid, midValue: a[mid], target },
    });

    if (a[mid] === target) {
      push({
        type: 'found',
        low,
        high,
        mid,
        foundIndex: mid,
        eliminated,
        what: `Found ${target} at index ${mid}!`,
        why: 'The middle value equals the target, so the search succeeds.',
        trace: { foundIndex: mid, target },
      });
      return steps;
    }

    if (a[mid] < target) {
      for (let k = low; k <= mid; k += 1) eliminated.add(k);
      push({
        type: 'compare',
        low,
        high,
        mid,
        eliminated,
        what: `${a[mid]} < ${target}, so the target must be to the right.`,
        why: 'Everything from low up to mid is too small, so that whole left half is eliminated.',
        trace: { decision: `discard indices ${low}..${mid}`, newLow: mid + 1 },
      });
      low = mid + 1;
    } else {
      for (let k = mid; k <= high; k += 1) eliminated.add(k);
      push({
        type: 'compare',
        low,
        high,
        mid,
        eliminated,
        what: `${a[mid]} > ${target}, so the target must be to the left.`,
        why: 'Everything from mid to high is too large, so that whole right half is eliminated.',
        trace: { decision: `discard indices ${mid}..${high}`, newHigh: mid - 1 },
      });
      high = mid - 1;
    }
  }

  push({
    type: 'notFound',
    eliminated,
    what: `${target} is not present in the array.`,
    why: 'The search range became empty, which means the target does not exist here.',
    trace: { target },
  });
  return steps;
}
