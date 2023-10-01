import React, { useState, useCallback } from 'react';
import ReactFlow, {
    addEdge,
    ConnectionLineType,
    useNodesState,
    useEdgesState,
    Background,
    Controls,
  } from "reactflow";
  import dagre from 'dagre';

  import 'reactflow/dist/style.css';

const Map = ({skills}) => {
  const skillsAndDependencies = JSON.parse(skills)

  const initialNodes = [];
  const initialEdges = [];

  // Create nodes for skills
  skillsAndDependencies.forEach((skill, index) => {
     const node = {
      id: skill.skill,
      data: { label: skill.skill },
      position: { x: 100 + (index % 3) * 20, y: 10 + Math.floor(index / 3) * 200 },
    };

    // Apply a different color to the first node ('Soft Skills')
    if (index === 0) {
      node.style = { background: '#FF5733', color: '#fff' };
    }

    initialNodes.push(node);
  });

  // Create edges for dependencies
  skillsAndDependencies.forEach((skill) => {
    if (skill.dependsOn !== null) { // Only add an edge if there is a dependency
      initialEdges.push({
        id: `${skill.skill}-${skill.dependsOn}`,
        source: skill.dependsOn,
        target: skill.skill,
        animated: true,
      });
    }
  });

  const nodeStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    borderRadius: '4px',
  };

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = 172;
  const nodeHeight = 36;
  
  const getLayoutedElements = (nodes, edges, direction) => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });
  
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
  
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
  
    dagre.layout(dagreGraph);
  
    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? "left" : "top";
      node.sourcePosition = isHorizontal ? "right" : "bottom";
  
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
  
      return node;
    });
  
    return { nodes, edges };
  };
  
  // graph direction options
  // TB - top to bottom
  // BT - bottom to top
  // LR - left to right
  // RL - right to left
  const direction = "LR";
  
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges,
    direction
  );
  
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  
    const onConnect = useCallback(
      (params) =>
        setEdges((eds) =>
          addEdge(
            { ...params, type: ConnectionLineType.SmoothStep, animated: true },
            eds
          )
        ),
      []
    );

    
  
  return (
    <div style={{ height: '400px', background: "#ccd7e7"}}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Map;