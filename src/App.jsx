// import React, { useState, useRef } from "react";
// import "./App.css";

// const App = () => {
//   const [polygons, setPolygons] = useState([]); // List of polygons
//   const [currentPolygon, setCurrentPolygon] = useState([]); // Points for the current polygon
//   const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(null); // Index of the selected polygon
//   const [draggingVertex, setDraggingVertex] = useState(null); // Vertex being dragged
//   const svgRef = useRef();

//   const handleSvgClick = (e) => {
//     const svg = svgRef.current;
//     const point = svg.createSVGPoint();
//     point.x = e.clientX;
//     point.y = e.clientY;
//     const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());

//     if (currentPolygon.length > 0) {
//       const [startX, startY] = currentPolygon[0];
//       if (Math.hypot(startX - x, startY - y) < 10) {
//         // Close polygon
//         setPolygons([...polygons, currentPolygon]);
//         setCurrentPolygon([]);
//         return;
//       }
//     }

//     setCurrentPolygon([...currentPolygon, [x, y]]);
//   };

//   const handleMouseMove = (e) => {
//     if (draggingVertex && selectedPolygonIndex !== null) {
//       const svg = svgRef.current;
//       const point = svg.createSVGPoint();
//       point.x = e.clientX;
//       point.y = e.clientY;
//       const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());

//       const updatedPolygons = [...polygons];
//       updatedPolygons[selectedPolygonIndex][draggingVertex] = [x, y];
//       setPolygons(updatedPolygons);
//     }
//   };

//   const handleMouseUp = () => {
//     setDraggingVertex(null);
//   };

//   const handleVertexMouseDown = (polygonIndex, vertexIndex) => {
//     setSelectedPolygonIndex(polygonIndex);
//     setDraggingVertex(vertexIndex);
//     // Move the selected polygon to the top layer
//     const updatedPolygons = [...polygons];
//     const selectedPolygon = updatedPolygons.splice(polygonIndex, 1)[0];
//     setPolygons([...updatedPolygons, selectedPolygon]);
//     setSelectedPolygonIndex(updatedPolygons.length); // Update to the new index of the selected polygon
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
//       <svg
//         ref={svgRef}
//         onClick={handleSvgClick}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         className="border border-gray-300"
//         width={800}
//         height={600}
//       >
//         {/* Render completed polygons */}
//         {polygons.map((polygon, index) => (
//           <g key={index}>
//             <polygon
//               points={polygon.map(([x, y]) => `${x},${y}`).join(" ")}
//               fill="rgba(0, 128, 255, 0.5)"
//               stroke="blue"
//               strokeWidth={1}
//             />
//             {polygon.map(([x, y], vertexIndex) => (
//               <circle
//                 key={vertexIndex}
//                 cx={x}
//                 cy={y}
//                 r={5}
//                 fill="red"
//                 onMouseDown={(e) => {
//                   e.stopPropagation();
//                   handleVertexMouseDown(index, vertexIndex);
//                 }}
//               />
//             ))}
//           </g>
//         ))}

//         {/* Render current polygon */}
//         {currentPolygon.length > 0 && (
//           <>
//             {/* Draw lines between points */}
//             {currentPolygon.map((point, index) => {
//               if (index === 0) return null;
//               const [prevX, prevY] = currentPolygon[index - 1];
//               const [x, y] = point;
//               return (
//                 <line
//                   key={index}
//                   x1={prevX}
//                   y1={prevY}
//                   x2={x}
//                   y2={y}
//                   stroke="blue"
//                   strokeWidth={1}
//                 />
//               );
//             })}
//             {/* Dashed line to follow the cursor */}
//             {currentPolygon.length > 1 && (
//               <line
//                 x1={currentPolygon[currentPolygon.length - 1][0]}
//                 y1={currentPolygon[currentPolygon.length - 1][1]}
//                 x2={currentPolygon[0][0]}
//                 y2={currentPolygon[0][1]}
//                 stroke="blue"
//                 strokeDasharray="4"
//                 strokeWidth={1}
//               />
//             )}
//             {currentPolygon.map(([x, y], index) => (
//               <circle key={index} cx={x} cy={y} r={5} fill="red" />
//             ))}
//           </>
//         )}
//       </svg>
//       <p className="mt-4 text-gray-600">
//         Click to add vertices. Click near the starting point to close the polygon. Drag points to edit.
//       </p>
//     </div>
//   );
// };

// export default App;



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
