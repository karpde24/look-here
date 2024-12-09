import React, { useState } from "react";
import { Graph } from "react-d3-graph";
import "../styles/GraphPage.css"; // Додайте ваш файл CSS

function GraphVisualization() {
  const [adjMatrix, setAdjMatrix] = useState([[0]]);
  const [nodes, setNodes] = useState([{ id: "0" }]);
  const [links, setLinks] = useState([]);

  const MAX_VERTICES = 15;

  const addVertex = () => {
    if (nodes.length >= MAX_VERTICES) {
      alert("Максимальна кількість вершин досягнута!");
      return;
    }

    const newMatrix = adjMatrix.map(row => [...row, 0]);
    newMatrix.push(new Array(nodes.length + 1).fill(0));
    setAdjMatrix(newMatrix);

    const newNode = { id: String(nodes.length) };
    setNodes([...nodes, newNode]);
  };

  const deleteVertex = (vertexId) => {
    const vertexIndex = parseInt(vertexId);

    if (isNaN(vertexIndex) || vertexIndex < 0 || vertexIndex >= adjMatrix.length) {
      alert("Некоректний номер вершини для видалення!");
      return;
    }

    const newMatrix = adjMatrix
      .filter((_, index) => index !== vertexIndex)
      .map(row => row.filter((_, index) => index !== vertexIndex));
    setAdjMatrix(newMatrix);

    const newNodes = nodes.filter(node => node.id !== vertexId);
    setNodes(newNodes);

    const newLinks = links.filter(
      link => link.source !== vertexId && link.target !== vertexId
    );
    setLinks(newLinks);
  };

  const addEdge = (source, target) => {
    try {
      const srcIndex = parseInt(source);
      const tgtIndex = parseInt(target);

      if (
        isNaN(srcIndex) ||
        isNaN(tgtIndex) ||
        srcIndex < 0 ||
        tgtIndex < 0 ||
        srcIndex >= adjMatrix.length ||
        tgtIndex >= adjMatrix.length
      ) {
        throw new Error("Некоректні дані для вершини. Перевірте введення!");
      }

      if (adjMatrix[srcIndex][tgtIndex] === 1) {
        alert("Ребро вже існує!");
        return;
      }

      const newMatrix = [...adjMatrix];
      newMatrix[srcIndex][tgtIndex] = 1;
      newMatrix[tgtIndex][srcIndex] = 1;
      setAdjMatrix(newMatrix);

      setLinks([...links, { source: source, target: target }]);
    } catch (error) {
      alert(error.message);
    }
  };

  const graphConfig = {
    nodeHighlightBehavior: true,
    node: { color: "lightblue", size: 300, highlightStrokeColor: "blue" },
    link: { highlightColor: "lightblue" },
    directed: false,
  };

  return (
    <div className="Page">
      <h2>Graph Visualization</h2>
      <div>
        <button onClick={addVertex}>Додати вершину</button>
        <button
          onClick={() => {
            const vertexId = prompt("Введіть номер вершини для видалення:");
            if (vertexId) {
              deleteVertex(vertexId);
            }
          }}
        >
          Видалити вершину
        </button>
        <button
          onClick={() => {
            try {
              const source = prompt("Введіть номер першої вершини (число):");
              const target = prompt("Введіть номер другої вершини (число):");
              if (!source || !target) {
                throw new Error("Введення відмінено або пусте!");
              }
              addEdge(source, target);
            } catch (error) {
              alert(error.message);
            }
          }}
        >
          Додати ребро
        </button>
      </div>
      <div className="GraphContainer">
        <Graph
          id="graph-id"
          data={{ nodes: nodes, links: links }}
          config={graphConfig}
        />
      </div>
      <h3>Матриця суміжності</h3>
      <div className="AdjacencyMatrix">
        <table>
          <thead>
            <tr>
              <th></th>
              {nodes.map((node, index) => (
                <th key={index}>{node.id}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adjMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th>{rowIndex}</th>
                {row.map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GraphVisualization;
