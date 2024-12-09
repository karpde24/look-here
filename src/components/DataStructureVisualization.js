import React, { useState } from "react";

function DataStructureVisualization() {
  const [stack, setStack] = useState([]);

  const pushToStack = () => {
    const value = Math.floor(Math.random() * 100);
    setStack([...stack, value]);
  };

  const popFromStack = () => {
    if (stack.length > 0) {
      setStack(stack.slice(0, -1));
    } else {
      alert("Stack is empty!");
    }
  };

  return (
    <div>
      <h3>Stack Visualization</h3>
      <div style={{ display: "flex", flexDirection: "column-reverse", gap: "5px", margin: "10px 0" }}>
        {stack.map((item, index) => (
          <div
            key={index}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "lightblue",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid black"
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <button onClick={pushToStack}>Push</button>
      <button onClick={popFromStack}>Pop</button>
    </div>
  );
}

export default DataStructureVisualization;
