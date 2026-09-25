// Pure Merge Sort step generator producing a snapshot of the recursion tree at
// every meaningful event so the UI can visualise divide-and-conquer.
export function mergeSortSteps(input) {
  const n = input.length;
  const steps = [];
  const nodes = {}; // id -> { id, lo, hi, depth, values, status, comparing }
  let idCounter = 0;

  function buildTree(lo, hi, depth) {
    const id = idCounter;
    idCounter += 1;
    nodes[id] = {
      id,
      lo,
      hi,
      depth,
      values: input.slice(lo, hi + 1),
      status: 'hidden',
      comparing: [],
    };
    const node = { id, lo, hi, depth, left: null, right: null };
    if (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      node.left = buildTree(lo, mid, depth + 1);
      node.right = buildTree(mid + 1, hi, depth + 1);
    }
    return node;
  }

  const snapshot = (s) => {
    const nodeList = Object.values(nodes)
      .filter((nd) => nd.status !== 'hidden')
      .map((nd) => ({ ...nd, values: [...nd.values], comparing: [...nd.comparing] }));
    steps.push({
      id: steps.length,
      total: n,
      nodes: nodeList,
      activeId: s.activeId == null ? null : s.activeId,
      type: s.type,
      what: s.what,
      why: s.why,
      trace: s.trace || {},
    });
  };

  if (n === 0) {
    snapshot({
      type: 'complete',
      activeId: null,
      what: 'The array is empty — nothing to sort.',
      why: 'A single element (or none) is the base case of the recursion.',
      trace: { length: 0 },
    });
    return steps;
  }

  const root = buildTree(0, n - 1, 0);

  if (n === 1) {
    nodes[root.id].status = 'sorted';
    snapshot({
      type: 'complete',
      activeId: root.id,
      what: `Only one element (${input[0]}) — already sorted.`,
      why: 'A single element is the base case of the recursion.',
      trace: { length: 1 },
    });
    return steps;
  }

  nodes[root.id].status = 'unsorted';
  snapshot({
    type: 'start',
    activeId: root.id,
    what: `Starting Merge Sort on ${n} elements.`,
    why: 'Merge Sort splits the array in half repeatedly, then merges the sorted halves back together.',
    trace: { length: n },
  });

  function sort(node) {
    const nd = nodes[node.id];
    if (node.lo === node.hi) {
      nd.status = 'sorted';
      snapshot({
        type: 'split',
        activeId: node.id,
        what: `Range [${node.lo}] holds a single value (${nd.values[0]}) — base case reached.`,
        why: 'A one-element range is already sorted, so recursion stops here.',
        trace: { range: `[${node.lo}]`, value: nd.values[0] },
      });
      return [...nd.values];
    }

    nd.status = 'splitting';
    nodes[node.left.id].status = 'unsorted';
    nodes[node.right.id].status = 'unsorted';
    snapshot({
      type: 'split',
      activeId: node.id,
      what: `Split range [${node.lo}..${node.hi}] into [${node.left.lo}..${node.left.hi}] and [${node.right.lo}..${node.right.hi}].`,
      why: 'Divide and conquer: keep halving until every piece is trivially sorted.',
      trace: { range: `${node.lo}..${node.hi}`, mid: node.left.hi },
    });

    const leftVals = sort(node.left);
    const rightVals = sort(node.right);

    nd.status = 'merging';
    nodes[node.left.id].status = 'merging';
    nodes[node.right.id].status = 'merging';
    snapshot({
      type: 'merge',
      activeId: node.id,
      what: `Merging sorted halves [${leftVals.join(', ')}] and [${rightVals.join(', ')}].`,
      why: 'Two sorted lists can be combined by repeatedly taking the smaller front element.',
      trace: { left: `[${leftVals.join(', ')}]`, right: `[${rightVals.join(', ')}]` },
    });

    const merged = [];
    let i = 0;
    let j = 0;
    while (i < leftVals.length && j < rightVals.length) {
      nodes[node.left.id].comparing = [i];
      nodes[node.right.id].comparing = [j];
      const take = leftVals[i] <= rightVals[j];
      snapshot({
        type: 'compare',
        activeId: node.id,
        what: `Compare ${leftVals[i]} and ${rightVals[j]} → take ${take ? leftVals[i] : rightVals[j]}.`,
        why: 'The smaller front value goes next into the merged result.',
        trace: { comparing: `${leftVals[i]} vs ${rightVals[j]}`, take: take ? leftVals[i] : rightVals[j] },
      });
      if (take) {
        merged.push(leftVals[i]);
        i += 1;
      } else {
        merged.push(rightVals[j]);
        j += 1;
      }
      nd.values = [...merged, ...leftVals.slice(i), ...rightVals.slice(j)];
    }
    while (i < leftVals.length) {
      merged.push(leftVals[i]);
      i += 1;
      nd.values = [...merged, ...rightVals.slice(j)];
    }
    while (j < rightVals.length) {
      merged.push(rightVals[j]);
      j += 1;
      nd.values = [...merged];
    }

    nodes[node.left.id].comparing = [];
    nodes[node.right.id].comparing = [];
    nodes[node.left.id].status = 'sorted';
    nodes[node.right.id].status = 'sorted';
    nd.values = merged;
    nd.status = 'sorted';
    snapshot({
      type: 'merge',
      activeId: node.id,
      what: `Merged into sorted [${merged.join(', ')}].`,
      why: 'This range is now fully sorted and ready to merge one level up.',
      trace: { result: `[${merged.join(', ')}]` },
    });
    return merged;
  }

  const result = sort(root);
  snapshot({
    type: 'complete',
    activeId: root.id,
    what: `Sorted! Final array: [${result.join(', ')}].`,
    why: 'All halves have merged back into a single sorted array.',
    trace: { result: `[${result.join(', ')}]` },
  });
  return steps;
}
