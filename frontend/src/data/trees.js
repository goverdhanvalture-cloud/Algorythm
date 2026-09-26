export const TREE_PRESETS = {
  simple: {
    label: 'Simple Binary Tree',
    root: 0,
    nodes: {
      0: { id: 0, left: 1, right: 2, x: 300, y: 50 },
      1: { id: 1, left: 3, right: 4, x: 150, y: 150 },
      2: { id: 2, left: null, right: 5, x: 450, y: 150 },
      3: { id: 3, left: null, right: null, x: 75, y: 250 },
      4: { id: 4, left: null, right: null, x: 225, y: 250 },
      5: { id: 5, left: null, right: null, x: 525, y: 250 },
    }
  },
  complete: {
    label: 'Complete Binary Tree',
    root: 0,
    nodes: {
      0: { id: 0, left: 1, right: 2, x: 300, y: 50 },
      1: { id: 1, left: 3, right: 4, x: 180, y: 130 },
      2: { id: 2, left: 5, right: 6, x: 420, y: 130 },
      3: { id: 3, left: null, right: null, x: 120, y: 210 },
      4: { id: 4, left: null, right: null, x: 240, y: 210 },
      5: { id: 5, left: null, right: null, x: 360, y: 210 },
      6: { id: 6, left: null, right: null, x: 480, y: 210 },
    }
  },
  full: {
    label: 'Full Binary Tree',
    root: 0,
    nodes: {
      0: { id: 0, left: 1, right: 2, x: 300, y: 50 },
      1: { id: 1, left: null, right: null, x: 180, y: 150 },
      2: { id: 2, left: 3, right: 4, x: 420, y: 150 },
      3: { id: 3, left: null, right: null, x: 340, y: 250 },
      4: { id: 4, left: null, right: null, x: 500, y: 250 },
    }
  },
  bst: {
    label: 'Binary Search Tree (BST)',
    root: 50,
    nodes: {
      50: { id: 50, left: 30, right: 70, x: 300, y: 50 },
      30: { id: 30, left: 20, right: 40, x: 180, y: 150 },
      70: { id: 70, left: 60, right: 80, x: 420, y: 150 },
      20: { id: 20, left: null, right: null, x: 120, y: 250 },
      40: { id: 40, left: null, right: null, x: 240, y: 250 },
      60: { id: 60, left: null, right: null, x: 360, y: 250 },
      80: { id: 80, left: null, right: null, x: 480, y: 250 },
    }
  }
};
