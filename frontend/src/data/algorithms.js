import { bubbleSortSteps } from '@/algorithms/bubbleSort';
import { mergeSortSteps } from '@/algorithms/mergeSort';
import { binarySearchSteps } from '@/algorithms/binarySearch';
import { bfsSteps } from '@/algorithms/bfs';
import { dfsSteps } from '@/algorithms/dfs';

// Metadata + info for each algorithm. Step generators live in /algorithms.
export const ALGORITHMS = {
  bubble: {
    key: 'bubble',
    name: 'Bubble Sort',
    short: 'Sorting',
    kind: 'sort',
    generate: bubbleSortSteps,
    testId: 'algo-nav-bubble-sort',
    description:
      'Repeatedly steps through the list, comparing adjacent pairs and swapping them when out of order. The largest values "bubble" to the end pass by pass.',
    intuition:
      'After each full pass the biggest remaining value locks into its final place at the end.',
    legend: ['neutral', 'comparing', 'swapping', 'sorted'],
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  },
  merge: {
    key: 'merge',
    name: 'Merge Sort',
    short: 'Divide & Conquer',
    kind: 'merge',
    generate: mergeSortSteps,
    testId: 'algo-nav-merge-sort',
    description:
      'A divide-and-conquer algorithm. It splits the array in half recursively until single elements remain, then merges sorted halves back together.',
    intuition:
      'Merging two already-sorted lists is easy, so we keep splitting until the pieces are trivially sorted.',
    legend: ['neutral', 'selected', 'comparing', 'sorted'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  },
  binary: {
    key: 'binary',
    name: 'Binary Search',
    short: 'Searching',
    kind: 'binary',
    generate: binarySearchSteps,
    testId: 'algo-nav-binary-search',
    description:
      'Finds a target inside a sorted array by repeatedly inspecting the middle element and discarding the half that cannot contain the target.',
    intuition:
      'Because the data is sorted, one comparison lets us throw away half of what remains.',
    legend: ['neutral', 'selected', 'eliminated', 'found'],
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  },
  bfs: {
    key: 'bfs',
    name: 'Breadth-First Search',
    short: 'Graph Traversal',
    kind: 'graph',
    generate: bfsSteps,
    testId: 'algo-nav-bfs',
    description:
      'Explores a graph level by level using a FIFO queue. It visits all neighbours of a node before moving deeper, marking nodes visited to handle cycles.',
    intuition:
      'A queue guarantees closer nodes are explored before farther ones — great for shortest paths in unweighted graphs.',
    legend: ['neutral', 'active', 'visited', 'comparing'],
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  },
  dfs: {
    key: 'dfs',
    name: 'Depth-First Search',
    short: 'Graph Traversal',
    kind: 'graph',
    generate: dfsSteps,
    testId: 'algo-nav-dfs',
    description:
      'Explores as deep as possible along each branch before backtracking, using a stack (the call stack). Visited nodes are marked to handle cycles.',
    intuition:
      'Go deep first; when a branch is exhausted, backtrack to the last node with unexplored neighbours.',
    legend: ['neutral', 'active', 'visited', 'comparing'],
    complexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
  },
};

export const ALGO_ORDER = ['bubble', 'merge', 'binary', 'bfs', 'dfs'];
