// Pure Bubble Sort step generator. Never touches the DOM.
export function bubbleSortSteps(input) {
  const a = [...input];
  const n = a.length;
  const steps = [];

  const push = (s) =>
    steps.push({
      id: steps.length,
      array: [...a],
      comparing: s.comparing || [],
      swapping: s.swapping || [],
      sortedFrom: s.sortedFrom == null ? n : s.sortedFrom,
      type: s.type,
      what: s.what,
      why: s.why,
      trace: s.trace || {},
    });

  if (n <= 1) {
    push({
      type: 'complete',
      sortedFrom: 0,
      what: n === 0 ? 'The array is empty — there is nothing to sort.' : `Only one element (${a[0]}) — it is already sorted.`,
      why: 'A list with zero or one element is trivially sorted, so the algorithm stops immediately.',
      trace: { length: n, comparisons: 0, swaps: 0 },
    });
    return steps;
  }

  push({
    type: 'start',
    sortedFrom: n,
    what: `Starting Bubble Sort on ${n} elements.`,
    why: 'We will repeatedly compare adjacent pairs and swap them when the left one is larger.',
    trace: { length: n, comparisons: 0, swaps: 0 },
  });

  let comparisons = 0;
  let swaps = 0;
  let sortedFrom = n;

  for (let i = 0; i < n - 1; i += 1) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j += 1) {
      comparisons += 1;
      const left = a[j];
      const right = a[j + 1];
      push({
        type: 'compare',
        comparing: [j, j + 1],
        sortedFrom,
        what: `Compare index ${j} (${left}) with index ${j + 1} (${right}).`,
        why: 'We check whether the left element is greater than its right neighbour; if so, they are out of order.',
        trace: {
          pass: i + 1,
          comparing: `${left} vs ${right}`,
          decision: left > right ? `${left} > ${right} → swap` : `${left} ≤ ${right} → keep`,
          comparisons,
          swaps,
        },
      });
      if (left > right) {
        a[j] = right;
        a[j + 1] = left;
        swaps += 1;
        push({
          type: 'swap',
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sortedFrom,
          what: `Swap ${left} and ${right} so the larger value moves right.`,
          why: 'The larger value bubbles toward the end where it belongs.',
          trace: { pass: i + 1, swapped: `${left} ↔ ${right}`, comparisons, swaps },
        });
        swapped = true;
      }
    }
    sortedFrom = n - 1 - i;
    push({
      type: 'select',
      sortedFrom,
      what: `Index ${sortedFrom} is locked — it now holds the largest unsorted value.`,
      why: 'After each pass, the largest remaining element settles into its final position.',
      trace: { pass: i + 1, lockedIndex: sortedFrom, comparisons, swaps },
    });
    if (!swapped) {
      push({
        type: 'select',
        sortedFrom: 0,
        what: 'No swaps happened in this pass — the array is already ordered.',
        why: 'If a full pass makes no swaps, everything is sorted and we can stop early.',
        trace: { pass: i + 1, comparisons, swaps },
      });
      break;
    }
  }

  push({
    type: 'complete',
    sortedFrom: 0,
    what: `Sorted! Final array: [${a.join(', ')}].`,
    why: 'Every element is now in its correct position.',
    trace: { comparisons, swaps },
  });
  return steps;
}
