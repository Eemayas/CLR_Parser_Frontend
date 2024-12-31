/** @format */

import { StateList } from "@/app/constant";
import React from "react";
import ReactFlow, { Node, Edge, Background, Position } from "reactflow";
import "reactflow/dist/style.css";

const calculateNodePositions = (
  currentId: string,
  x: number,
  y: number,
  positions: Record<string, { x: number; y: number }>,
  visited: Set<string>,
  states: StateList
) => {
  if (visited.has(currentId)) return;
  visited.add(currentId);

  // Set the position of the current node
  positions[currentId] = { x, y };

  // Calculate positions for transitions
  const children = Object.entries(states[currentId].transitions);
  let nextY = y; // Start calculating vertically
  children.forEach(([symbol, target], index) => {
    if (!visited.has(target)) {
      const nextX = x + 150; // Reduced horizontal spacing
      calculateNodePositions(target, nextX, nextY, positions, visited, states);
      nextY += 150; // Reduced vertical spacing
    }
  });
};

interface StateGraphProps {
  states: StateList;
}

const StateGraph: React.FC<StateGraphProps> = ({ states }) => {
  const positions: Record<string, { x: number; y: number }> = {};
  calculateNodePositions("I0", 0, 0, positions, new Set(), states);

  // Create nodes with calculated positions
  const nodes: Node[] = Object.keys(states).map((state) => ({
    id: state,
    data: {
      label: (
        <div className="flex flex-col items-center">
          {states[state].items.map((item, index) => (
            <div key={index} className="border border-1 border-gray-500">
              {item}
            </div>
          ))}
        </div>
      ),
    },
    position: positions[state],
    draggable: true, // Ensure this is true for all nodes
    style: {
      width: 100,
      height: "fit",
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

  // Add labels for IDs and items
  nodes.forEach((node) => {
    node.data.label = (
      <div style={{ position: "relative", textAlign: "center" }}>
        <div
          style={{
            fontSize: "10px", // Smaller font for compactness
            fontWeight: "bold",
            color: "#555",
          }}
        >
          {node.id}
        </div>
        <div style={{ whiteSpace: "pre-wrap", fontSize: "8px" }}>
          {states[node.id].items.join("\n")}
        </div>
      </div>
    );
  });

  // Convert transitions into React Flow edges
  const edges: Edge[] = Object.entries(states).flatMap(
    ([state, { transitions }]) =>
      Object.entries(transitions).map(([symbol, target]) => ({
        id: `${state}-${symbol}-${target}`,
        source: state,
        target,
        label: symbol,
        type: "smooth",
        style: { stroke: "#888" },
        labelStyle: { fontSize: "8px" }, // Smaller font for edge labels
      }))
  );
  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    console.log(`Node clicked: ${node.id}`);
  };

  // Pass this handler to ReactFlow's node interaction props.

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        nodesDraggable={true} // Ensure this is true
      >
        <Background gap={10} size={0.5} /> {/* Smaller grid background */}
      </ReactFlow>
    </>
  );
};

export default StateGraph;
