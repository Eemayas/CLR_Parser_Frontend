/** @format */

// /** @format */

// import { StateGraphProps, StateList } from "@/types";
// import React, { useState } from "react";
// import ReactFlow, {
//   Node,
//   Edge,
//   Background,
//   Position,
//   OnNodesChange,
// } from "reactflow";
// import "reactflow/dist/style.css";

// const calculateNodePositions = (
//   currentId: string,
//   x: number,
//   y: number,
//   positions: Record<string, { x: number; y: number }> = {},
//   visited: Set<string> = new Set(),
//   states: StateList = {},
//   levelSpacing: number = 150, // Adjust horizontal spacing dynamically
//   siblingSpacing: number = 200, // Adjust vertical spacing dynamically
//   columnOccupied: Record<number, number[]> = {}, // Track y-positions in each column to check for overlap
//   columnStates: Record<number, string[]> = {} // Track states in each column
// ) => {
//   if (visited.has(currentId)) return;
//   visited.add(currentId);

//   // Set the position of the current node
//   positions[currentId] = { x, y };

//   // Track states in the current column
//   if (!columnStates[x]) columnStates[x] = [];
//   columnStates[x].push(currentId);

//   // Calculate positions for transitions
//   const children = Object.entries(states[currentId].transitions);
//   const offset = Math.floor((children.length - 1) / 2); // Center children nodes

//   children.forEach(([symbol, target], index) => {
//     if (!visited.has(target)) {
//       const nextX = x + levelSpacing;
//       let nextY = y + (index - offset) * siblingSpacing;

//       // Check if the y-position in the next column is already occupied
//       while (columnOccupied[nextX] && columnOccupied[nextX].includes(nextY)) {
//         nextY += siblingSpacing; // Shift downward until no overlap
//       }

//       // Mark the new position as occupied
//       if (!columnOccupied[nextX]) columnOccupied[nextX] = [];
//       columnOccupied[nextX].push(nextY);

//       // Recurse to the next node
//       calculateNodePositions(
//         target,
//         nextX,
//         nextY,
//         positions,
//         visited,
//         states,
//         levelSpacing,
//         siblingSpacing,
//         columnOccupied,
//         columnStates
//       );
//     }
//   });
// };

// const StateGraph: React.FC<StateGraphProps> = ({ states }) => {
//   if (Object.keys(states).length === 0) return null;

//   const [nodePositions, setNodePositions] = useState<
//     Record<string, { x: number; y: number }>
//   >({});
//   const columnStates: Record<number, string[]> = {}; // Track states in columns

//   // Initialize the positions
//   React.useEffect(() => {
//     const initialPositions: Record<string, { x: number; y: number }> = {};
//     calculateNodePositions(
//       "I0",
//       0,
//       0,
//       initialPositions,
//       new Set(),
//       states,
//       150,
//       200,
//       {},
//       columnStates
//     );

//     // Adjust the height based on the number of nodes in each column
//     const nodeHeightAdjustment = 50; // Additional height for each state in the column
//     Object.entries(columnStates).forEach(([col, statesInColumn]) => {
//       const columnHeight = statesInColumn.length * nodeHeightAdjustment;
//       statesInColumn.forEach((state, index) => {
//         initialPositions[state].y =
//           initialPositions[state].y + (columnHeight - nodeHeightAdjustment) / 2;
//       });
//     });

//     setNodePositions(initialPositions);
//   }, [states]);

//   // Handle node position change on drag
//   const onNodesChange: OnNodesChange = (changes) => {
//     const updatedPositions = { ...nodePositions };

//     changes.forEach((change) => {
//       if (change.type === "position") {
//         const { id, position } = change;
//         if (id) {
//           if (position) {
//             updatedPositions[id] = position;
//           }
//         }
//       }
//     });

//     setNodePositions(updatedPositions);
//   };

//   // Create nodes with the updated positions
//   const nodes: Node[] = Object.keys(states).map((state) => ({
//     position: nodePositions[state] || { x: 0, y: 0 },
//     id: state,
//     data: {
//       label: (
//         <div className="flex flex-col items-center">
//           <div className="underline mb-2">{state}</div>
//           {states[state].items.map((item, index) => (
//             <div key={index} className="">
//               {item}
//             </div>
//           ))}
//         </div>
//       ),
//     },
//     style: {
//       width: 100,
//       height: "fit-content",
//       borderRadius: "10%",
//       border: "1px solid #aaa",
//       backgroundColor: "#f9f9f9",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       fontSize: "10px",
//     },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//   }));

//   // Convert transitions into React Flow edges
//   const edges: Edge[] = Object.entries(states).flatMap(
//     ([state, { transitions }]) =>
//       Object.entries(transitions).map(([symbol, target]) => ({
//         id: `${state}-${symbol}-${target}`,
//         source: state,
//         target,
//         label: symbol,
//         style: { stroke: "#888" },
//         labelStyle: { fontSize: "8px" },
//       }))
//   );

//   return (
//     <div style={{ width: "80%", height: "80vh" }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         fitView
//         fitViewOptions={{ padding: 0.1 }}
//         nodesDraggable={true} // Ensure nodes are draggable
//         onNodeDragStop={(event, node) => {
//           // Ensure only the dragged node is updated
//           const updatedPositions = {
//             ...nodePositions,
//             [node.id]: node.position,
//           };
//           setNodePositions(updatedPositions);
//         }}
//         onNodesChange={onNodesChange} // Add the event listener for node changes
//       >
//         <Background gap={10} size={0.5} />
//       </ReactFlow>
//     </div>
//   );
// };

// export default StateGraph;

/** @format */

import { StateGraphProps, StateList } from "@/types";
import React from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Position,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

const calculateNodePositions = (
  currentId: string,
  x: number,
  y: number,
  positions: Record<string, { x: number; y: number }> = {},
  visited: Set<string> = new Set(),
  states: StateList = {},
  levelSpacing: number = 150, // Adjust horizontal spacing dynamically
  siblingSpacing: number = 200, // Adjust vertical spacing dynamically
  columnOccupied: Record<number, number[]> = {}, // Track y-positions in each column to check for overlap
  columnStates: Record<number, string[]> = {} // Track states in each column
) => {
  if (visited.has(currentId)) return;
  visited.add(currentId);

  // Set the position of the current node
  positions[currentId] = { x, y };

  // Track states in the current column
  if (!columnStates[x]) columnStates[x] = [];
  columnStates[x].push(currentId);

  // Calculate positions for transitions
  const children = Object.entries(states[currentId].transitions);
  const offset = Math.floor((children.length - 1) / 2); // Center children nodes

  children.forEach(([symbol, target], index) => {
    if (!visited.has(target)) {
      const nextX = x + levelSpacing;
      let nextY = y + (index - offset) * siblingSpacing;

      // Check if the y-position in the next column is already occupied
      while (columnOccupied[nextX] && columnOccupied[nextX].includes(nextY)) {
        nextY += siblingSpacing; // Shift downward until no overlap
      }

      // Mark the new position as occupied
      if (!columnOccupied[nextX]) columnOccupied[nextX] = [];
      columnOccupied[nextX].push(nextY);

      // Recurse to the next node
      calculateNodePositions(
        target,
        nextX,
        nextY,
        positions,
        visited,
        states,
        levelSpacing,
        siblingSpacing,
        columnOccupied,
        columnStates
      );
    }
  });
};

const StateGraph: React.FC<StateGraphProps> = ({ states }) => {
  if (Object.keys(states).length === 0) return null;

  const positions: Record<string, { x: number; y: number }> = {};
  const columnStates: Record<number, string[]> = {}; // Track states in columns
  calculateNodePositions(
    "I0",
    0,
    0,
    positions,
    new Set(),
    states,
    150,
    200,
    {},
    columnStates
  );

  // Adjust the height based on the number of nodes in each column
  const nodeHeightAdjustment = 50; // Additional height for each state in the column
  Object.entries(columnStates).forEach(([col, statesInColumn]) => {
    const columnHeight = statesInColumn.length * nodeHeightAdjustment;
    statesInColumn.forEach((state, index) => {
      positions[state].y =
        positions[state].y + (columnHeight - nodeHeightAdjustment) / 2;
    });
  });

  // Create nodes without specifying positions
  const nodes: Node[] = Object.keys(states).map((state) => ({
    position: positions[state],
    id: state,
    data: {
      label: (
        <div className="flex flex-col items-center">
          <div className="underline mb-2">{state}</div>
          {states[state].items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      ),
    },

    style: {
      width: 100,
      height: "fit-content",
      borderRadius: "10%",
      border: "1px solid #aaa",
      backgroundColor: "#f9f9f9",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "10px",
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));

  // Convert transitions into React Flow edges
  const edges: Edge[] = Object.entries(states).flatMap(
    ([state, { transitions }]) =>
      Object.entries(transitions).map(([symbol, target]) => ({
        id: `${state}-${symbol}-${target}`,
        source: state,
        target,
        label: symbol,
        style: { stroke: "#888" },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        labelStyle: {
          fontSize: "10px",
          // textDecoration: "underline",
        },
      }))
  );

  return (
    <div style={{ width: "80%", height: "80vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        nodesDraggable
        onNodeClick={(event, node) => console.log(`Node clicked: ${node.id}`)}
      >
        <Background gap={10} size={0.5} />
      </ReactFlow>
    </div>
  );
};

export default StateGraph;
