// Pure DFS step generator for binary trees.
export function dfsSteps(tree, traversalType = 'preorder') {
  const steps = [];
  const visited = new Set();
  const order = [];
  const stack = []; // current recursion path

  const push = (s) =>
    steps.push({
      id: steps.length,
      visited: [...visited],
      order: [...order],
      stack: [...stack],
      current: s.current == null ? null : s.current,
      exploreEdge: s.exploreEdge || null,
      type: s.type,
      what: s.what,
      why: s.why,
      trace: s.trace || {},
    });

  if (!tree || tree.root == null) return steps;

  push({
    type: 'start',
    what: `Start DFS (${traversalType}) from root node ${tree.root}.`,
    why: 'DFS dives as deep as possible along a branch before backtracking, using the call stack.',
    trace: { start: tree.root, stack: '[ ]' },
  });

  function dfs(nodeId, parentId) {
    if (nodeId == null) return;
    
    stack.push(nodeId);
    
    push({
      type: 'visit',
      current: nodeId,
      exploreEdge: parentId == null ? null : [parentId, nodeId],
      what: `Arrive at node ${nodeId} and push onto the call stack.`,
      why: 'We go deep first.',
      trace: { stack: `[ ${stack.join(', ')} ]` },
    });

    const node = tree.nodes[nodeId];

    if (traversalType === 'preorder') {
      order.push(nodeId);
      visited.add(nodeId);
      push({
        type: 'process',
        current: nodeId,
        what: `Process node ${nodeId} (Preorder).`,
        why: 'In preorder, we process the node before its children (Root → Left → Right).',
        trace: { order: order.join(' → ') },
      });
    }

    if (node.left != null) {
      push({
        type: 'compare',
        current: nodeId,
        exploreEdge: [nodeId, node.left],
        what: `Go left to child ${node.left}.`,
        why: 'Recursing into the left subtree.',
      });
      dfs(node.left, nodeId);
      push({
        type: 'backtrack',
        current: nodeId,
        what: `Back at node ${nodeId} after exploring left subtree.`,
        why: 'Left subtree is fully explored.',
        trace: { stack: `[ ${stack.join(', ')} ]` },
      });
    } else {
      push({
        type: 'compare',
        current: nodeId,
        what: `No left child.`,
        why: 'Left subtree is empty.',
      });
    }

    if (traversalType === 'inorder') {
      order.push(nodeId);
      visited.add(nodeId);
      push({
        type: 'process',
        current: nodeId,
        what: `Process node ${nodeId} (Inorder).`,
        why: 'In inorder, we process the node after its left child but before right (Left → Root → Right).',
        trace: { order: order.join(' → ') },
      });
    }

    if (node.right != null) {
      push({
        type: 'compare',
        current: nodeId,
        exploreEdge: [nodeId, node.right],
        what: `Go right to child ${node.right}.`,
        why: 'Recursing into the right subtree.',
      });
      dfs(node.right, nodeId);
      push({
        type: 'backtrack',
        current: nodeId,
        what: `Back at node ${nodeId} after exploring right subtree.`,
        why: 'Right subtree is fully explored.',
        trace: { stack: `[ ${stack.join(', ')} ]` },
      });
    } else {
      push({
        type: 'compare',
        current: nodeId,
        what: `No right child.`,
        why: 'Right subtree is empty.',
      });
    }

    if (traversalType === 'postorder') {
      order.push(nodeId);
      visited.add(nodeId);
      push({
        type: 'process',
        current: nodeId,
        what: `Process node ${nodeId} (Postorder).`,
        why: 'In postorder, we process the node after both children (Left → Right → Root).',
        trace: { order: order.join(' → ') },
      });
    }

    stack.pop();
    push({
      type: 'dequeue',
      current: stack.length ? stack[stack.length - 1] : null,
      what: `Finished node ${nodeId} — pop from stack (backtrack).`,
      why: 'Both subtrees are explored, return to the parent node.',
      trace: { stack: `[ ${stack.join(', ')} ]` },
    });
  }

  dfs(tree.root, null);
  
  push({
    type: 'complete',
    what: `DFS (${traversalType}) complete. Order: ${order.join(' → ')}.`,
    why: 'The stack is empty — all nodes have been visited.',
    trace: { order: order.join(' → ') },
  });
  
  return steps;
}
