// Preset graphs. Edges are undirected pairs. Positions are optional; when
// omitted the visualizer computes a circular layout.
export const GRAPH_PRESETS = {
  simple: {
    label: 'Simple (6 nodes)',
    edgesText: '0-1, 0-2, 1-3, 1-4, 2-4, 3-5, 4-5',
    start: 0,
    positions: {
      0: { x: 300, y: 50 },
      1: { x: 150, y: 150 },
      2: { x: 450, y: 150 },
      3: { x: 90, y: 280 },
      4: { x: 330, y: 260 },
      5: { x: 210, y: 330 },
    },
  },
  cycle: {
    label: 'With Cycles (5 nodes)',
    edgesText: '0-1, 1-2, 2-0, 2-3, 3-4, 4-1',
    start: 0,
    positions: {
      0: { x: 300, y: 60 },
      1: { x: 480, y: 190 },
      2: { x: 400, y: 320 },
      3: { x: 200, y: 320 },
      4: { x: 120, y: 190 },
    },
  },
  tree: {
    label: 'Binary Tree (7 nodes)',
    edgesText: '0-1, 0-2, 1-3, 1-4, 2-5, 2-6',
    start: 0,
    positions: {
      0: { x: 300, y: 50 },
      1: { x: 170, y: 170 },
      2: { x: 430, y: 170 },
      3: { x: 90, y: 300 },
      4: { x: 250, y: 300 },
      5: { x: 350, y: 300 },
      6: { x: 510, y: 300 },
    },
  },
};
