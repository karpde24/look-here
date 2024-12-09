import React, { useState, useEffect, useCallback } from "react";
import { Graph } from "react-d3-graph";
import "../styles/GraphPage.css";
import SimulationControl from "../components/SimulationControl";

function GraphPage() {
  const MAX_NODES = 15;
  const GRAPH_WIDTH = 1200;
  const GRAPH_HEIGHT = 600;

  const [matrix, setMatrix] = useState([
    [0, 1, 1, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 0, 0],
    [1, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 1, 0],
  ]);

  const [nodes, setNodes] = useState([
    { id: "0", color: "orange" },
    { id: "1", color: "orange" },
    { id: "2", color: "orange" },
    { id: "3", color: "orange" },
    { id: "4", color: "orange" },
    { id: "5", color: "orange" },
    { id: "6", color: "orange" },
  ]);

  const [links, setLinks] = useState([
    { source: "0", target: "1", color: "lightblue" },
    { source: "0", target: "2", color: "lightblue" },
    { source: "1", target: "2", color: "lightblue" },
    { source: "1", target: "3", color: "lightblue" },
    { source: "3", target: "4", color: "lightblue" },
    { source: "2", target: "4", color: "lightblue" },
    { source: "4", target: "5", color: "lightblue" },
    { source: "5", target: "6", color: "lightblue" },
  ]);

  const graphConfig = {
    nodeHighlightBehavior: true,
    staticGraph: false,
    d3: {
      gravity: -300,
    },
    node: { color: "orange", size: 300, fontSize: 14 },
    link: { highlightColor: "lightblue" },
    directed: false,
  };

  const arrangeNodesInCircle = useCallback(() => {
    const nodeCount = nodes.length;
    const centerX = GRAPH_WIDTH / 2;
    const centerY = GRAPH_HEIGHT / 2;
    const angleStep = (2 * Math.PI) / nodeCount;

    const arrangedNodes = nodes.map((node, index) => ({
      ...node,
      x: centerX + 200 * Math.cos(index * angleStep),
      y: centerY + 200 * Math.sin(index * angleStep),
    }));

    setNodes(arrangedNodes);
  }, [nodes, GRAPH_WIDTH, GRAPH_HEIGHT]);

  useEffect(() => {
    arrangeNodesInCircle();
  }, [nodes, arrangeNodesInCircle]);

  const updateMatrix = (rowIndex, colIndex, value) => {
    if (rowIndex >= matrix.length || colIndex >= matrix.length || rowIndex < 0 || colIndex < 0) {
      alert("Невірні індекси в матриці!");
      return;
    }

    const updatedMatrix = [...matrix];
    updatedMatrix[rowIndex][colIndex] = parseInt(value) || 0;
    updatedMatrix[colIndex][rowIndex] = parseInt(value) || 0;

    if (!nodes.find((node) => node.id === `${rowIndex}`)) {
      setNodes((prevNodes) => [...prevNodes, { id: `${rowIndex}` }]);
    }

    if (!nodes.find((node) => node.id === `${colIndex}`)) {
      setNodes((prevNodes) => [...prevNodes, { id: `${colIndex}` }]);
    }

    setMatrix(updatedMatrix);

    const newLinks = [];
    updatedMatrix.forEach((row, i) => {
      row.forEach((weight, j) => {
        if (weight !== 0 && nodes.some((n) => n.id === `${i}`) && nodes.some((n) => n.id === `${j}`)) {
          newLinks.push({
            source: `${i}`,
            target: `${j}`,
            label: weight > 0 ? `${weight}` : undefined,
          });
        }
      });
    });

    setLinks(newLinks);
  };

  const addNode = () => {
    if (nodes.length >= MAX_NODES) {
      alert(`Максимальна кількість вершин (${MAX_NODES}) досягнута!`);
      return;
    }

    const newMatrix = [...matrix];
    newMatrix.push(new Array(matrix.length).fill(0));
    newMatrix.forEach((row) => row.push(0));
    setMatrix(newMatrix);

    const newNode = {
      id: `${nodes.length}`,
      color: "orange",
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const deleteNode = () => {
    const nodeIdToDelete = prompt("Введіть номер вершини для видалення:");
    if (nodeIdToDelete === null || nodeIdToDelete === "") return;

    const nodeIndex = nodes.findIndex((node) => node.id === nodeIdToDelete);
    if (nodeIndex === -1) {
      alert("Вказана вершина не знайдена!");
      return;
    }

    const updatedMatrix = matrix.map((row, rowIndex) =>
      row.map((value, colIndex) =>
        rowIndex === nodeIndex || colIndex === nodeIndex ? 0 : value
      )
    );

    const updatedNodes = nodes.filter((node) => node.id !== nodeIdToDelete);

    const updatedLinks = links.filter(
      (link) => link.source !== nodeIdToDelete && link.target !== nodeIdToDelete
    );

    setMatrix(updatedMatrix);
    setNodes(updatedNodes);
    setLinks(updatedLinks);
  };

  return (
    <div className="GraphPage">
      <header>
        <h1>Graph with Adjacency Matrix</h1>
      </header>

      <div className="MatrixContainer">
        <h3>Матриця суміжності</h3>
        <table className="AdjacencyMatrix">
          <thead>
            <tr>
              <th></th>
              {matrix.map((_, colIndex) => (
                <th key={colIndex}>{colIndex}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th>{rowIndex}</th>
                {row.map((value, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        updateMatrix(rowIndex, colIndex, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="Controls">
        <button onClick={addNode}>Додати вершину</button>
        <button onClick={deleteNode}>Видалити вершину</button>
      </div>

      <div
        className="GraphContainer"
        style={{
          width: `${GRAPH_WIDTH}px`,
          height: `${GRAPH_HEIGHT}px`,
          margin: "20px auto",
          border: "1px solid #ccc",
        }}
      >
        <Graph
          id="graph-id"
          data={{ nodes, links }}
          config={graphConfig}
          className="GraphArea"
        />
      </div>

      {/* Додано компонент для моделювання */}
      <SimulationControl
        nodes={nodes}
        links={links}
        setNodes={setNodes}
        setLinks={setLinks}
        matrix={matrix}
      />
    </div>
  );
}

export default GraphPage;
