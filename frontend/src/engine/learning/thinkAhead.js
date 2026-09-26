export function generateThinkAheadQuestion(current, next, kind) {
  if (!current || !next) return null;

  if (kind === 'sort') {
    // Bubble sort
    if (current.type === 'compare' && next.type === 'swap') {
      return {
        question: 'What happens next?',
        options: [
          'Swap the two values',
          'Move to the next pair',
          'Mark both values sorted',
          'Restart the pass'
        ],
        answerIndex: 0,
        explanation: `The values are out of order, so they must be swapped.`
      };
    }
    if (current.type === 'compare' && next.type === 'compare') {
      // Meaning they didn't swap
      // Let's only ask this occasionally to not spam
      if (Math.random() > 0.7) {
        return {
          question: 'What happens next?',
          options: [
            'Swap the two values',
            'Move to the next pair',
            'Mark both values sorted',
            'Restart the pass'
          ],
          answerIndex: 1,
          explanation: `The values are already in the correct order, so the algorithm moves to the next pair.`
        };
      }
    }
  }

  if (kind === 'merge') {
    if (current.type === 'compare' && next.type === 'compare') {
      // Find out which one was taken
      const traceNext = next.trace;
      // We can inspect next.what to see what happened, or next.trace
      if (traceNext && traceNext.take !== undefined) {
         // This means it was a compare step that took something.
         // Actually, mergeSort.js outputs 'compare' for the comparison, but wait:
         // mergeSort.js only outputs 'compare' when taking!
         // `Compare X and Y -> take Z.`
         // So `current` is 'compare' and `next` is 'compare' or 'merge'.
         // Wait, the question should be asked BEFORE the element is taken.
         // But the step in mergeSort.js IS the comparison AND taking.
         // So if `next` is a 'compare' step, that means `next` WILL compare and take.
         // We can ask BEFORE `next` executes!
      }
    }
    
    // Let's just look at the `next` step. If `next` is a critical step, we ask what `next` will do.
    if (next.type === 'compare') {
      const takeVal = next.trace?.take;
      const leftVal = parseInt(next.trace?.comparing?.split(' vs ')[0]);
      const rightVal = parseInt(next.trace?.comparing?.split(' vs ')[1]);
      
      if (takeVal !== undefined) {
        return {
          question: `Comparing ${leftVal} and ${rightVal}. What happens next during this merge?`,
          options: [
            `Take ${leftVal} (the left value)`,
            `Take ${rightVal} (the right value)`,
            'Split the array again',
            'Finish the entire algorithm'
          ],
          answerIndex: takeVal === leftVal ? 0 : 1,
          explanation: `${takeVal} is smaller (or equal), so it is placed into the merged result first.`
        };
      }
    }
  }

  if (kind === 'binary') {
    if (next.type === 'compare') {
      // binarySearch outputs compare: 'Checking middle element X against target Y'
      // wait, binarySearch outputs:
      // compare: Checking middle element.
      // left: Target is smaller, searching left half.
      // right: Target is larger, searching right half.
      // found: Target found!
      if (current.type === 'compare' && ['left', 'right', 'found'].includes(next.type)) {
        let ans = 0;
        let exp = '';
        if (next.type === 'left') { ans = 0; exp = 'The middle value is larger than the target, so the target must be in the left half.'; }
        if (next.type === 'right') { ans = 1; exp = 'The middle value is smaller than the target, so the target must be in the right half.'; }
        if (next.type === 'found') { ans = 2; exp = 'The middle value matches the target!'; }
        
        return {
          question: `The middle value has been checked. What happens next?`,
          options: [
            'Search the left half',
            'Search the right half',
            'Target found',
            'Restart'
          ],
          answerIndex: ans,
          explanation: exp
        };
      }
    }
  }

  if (kind === 'tree') {
    // BFS / DFS
    // BFS: current.type === 'visit', next.type === 'enqueue' or 'visit'
    if (current.type === 'visit' || current.type === 'process') {
      if (next.type === 'enqueue' || next.type === 'push' || next.type === 'backtrack') {
         // Ask what happens next based on DFS/BFS logic
         // DFS outputs: 'push' (children), 'backtrack'
         // BFS outputs: 'enqueue' (children)
         if (next.type === 'backtrack') {
           return {
             question: 'DFS has finished exploring this branch. What happens next?',
             options: [
               'Backtrack to the parent',
               'Restart at root',
               'Visit an already completed node',
               'Finish immediately'
             ],
             answerIndex: 0,
             explanation: 'When a branch is fully explored, DFS backtracks to find the next unexplored path.'
           };
         }
         
         if (next.type === 'push' || next.type === 'enqueue') {
           return {
             question: 'The current node has been processed. What happens next?',
             options: [
               `Add its unvisited children to the ${next.type === 'push' ? 'stack' : 'queue'}`,
               'Process the root node again',
               'Remove the node completely',
               'Stop the traversal'
             ],
             answerIndex: 0,
             explanation: `We must explore this node's children, so we add them to the ${next.type === 'push' ? 'stack' : 'queue'}.`
           };
         }
      }
    }
  }

  return null;
}
