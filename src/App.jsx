

import React, { useState, useRef } from "react";
import "./App.css";

const App = () => {
  const [polygons, setPolygons] = useState([]); // List of polygons
  const [currentPolygon, setCurrentPolygon] = useState([]); // Points for the current polygon
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(null); // Selected polygon for editing
  const [draggingVertex, setDraggingVertex] = useState(null); // Vertex being dragged
  const [hoveredVertex, setHoveredVertex] = useState(null); // Vertex being hovered
  const svgRef = useRef();

  const handleSvgClick = (e) => {
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());

    if (currentPolygon.length > 0) {
      const [startX, startY] = currentPolygon[0];
      if (Math.hypot(startX - x, startY - y) < 10) {
        // Close polygon
        setPolygons([...polygons, currentPolygon]);
        setCurrentPolygon([]);
        return;
      }
    }

    setCurrentPolygon([...currentPolygon, [x, y]]);
  };

  const handleMouseMove = (e) => {
    if (draggingVertex && selectedPolygonIndex !== null) {
      const svg = svgRef.current;
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());

      const updatedPolygons = [...polygons];
      updatedPolygons[selectedPolygonIndex][draggingVertex] = [x, y];
      setPolygons(updatedPolygons);
    }
  };

  const handleMouseUp = () => {
    setDraggingVertex(null);
  };

  const handleVertexMouseDown = (polygonIndex, vertexIndex) => {
    setSelectedPolygonIndex(polygonIndex);
    setDraggingVertex(vertexIndex);
  };

  const handleVertexMouseEnter = (index) => {
    setHoveredVertex(index);
  };

  const handleVertexMouseLeave = () => {
    setHoveredVertex(null);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <svg
        ref={svgRef}
        onClick={handleSvgClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border border-gray-300"
        width={800}
        height={600}
      >
        {/* Render completed polygons */}
        {polygons.map((polygon, index) => (
          <g key={index}>
            <polygon
              points={polygon.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="rgba(0, 128, 255, 0.5)"
              stroke="blue"
              strokeWidth={1}
            />
            {polygon.map(([x, y], vertexIndex) => (
              <circle
                key={vertexIndex}
                cx={x}
                cy={y}
                r={5}
                fill={
                  vertexIndex === hoveredVertex ? "blue" : "green"
                }
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleVertexMouseDown(index, vertexIndex);
                }}
                onMouseEnter={() => handleVertexMouseEnter(vertexIndex)}
                onMouseLeave={handleVertexMouseLeave}
              />
            ))}
          </g>
        ))}

        {/* Render current polygon */}
        {currentPolygon.length > 0 && (
          <>
            <polyline
              points={currentPolygon.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="rgba(0, 128, 255, 0.3)"
              stroke="blue"
              strokeWidth={1}
            />
            {currentPolygon.map(([x, y], index) => (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={5}
                fill="red"
              />
            ))}
          </>
        )}
      </svg>
      <p className="mt-4 text-gray-600">
        Click to add vertices. Click near the starting point to close the polygon. Drag points to edit.
      </p>
    </div>
  );
};

export default App;
