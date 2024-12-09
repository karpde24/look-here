import React, { useState, useEffect } from "react";

const SimulationControl = ({ nodes, links, setNodes, setLinks }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);

  const handleStart = () => {
    setSteps(simulateTraversal());
    setIsRunning(true);
    setCurrentStepIndex(0);
    setPaused(false);
  };

  const handlePause = () => {
    setPaused(!paused);
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      applyStep(steps[currentStepIndex - 1]);
    }
  };

  const simulateTraversal = () => {
    // Моделюємо послідовність кроків
    return [
      { current: "0", visited: ["0"], queue: ["1", "2"] },
      { current: "1", visited: ["0", "1"], queue: ["2", "3", "4"] },
      { current: "2", visited: ["0", "1", "2"], queue: ["3", "4", "4"] },
      { current: "4", visited: ["0", "1", "2", "4"], queue: ["3", "5"] },
    ];
  };

  const applyStep = (step) => {
    // Оновлюємо вузли
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === step.current) return { ...node, color: "green" };
        if (step.visited.includes(node.id)) return { ...node, color: "gray" };
        return { ...node, color: "white" };
      })
    );

    // Оновлюємо ребра
    setLinks((prevLinks) =>
      prevLinks.map((link) => {
        if (
          step.queue.includes(link.source) ||
          step.queue.includes(link.target)
        )
          return { ...link, color: "yellow" };
        return { ...link, color: "black" };
      })
    );
  };

  useEffect(() => {
    if (isRunning && !paused && steps.length > 0) {
      const interval = setInterval(() => {
        if (currentStepIndex < steps.length) {
          applyStep(steps[currentStepIndex]);
          setCurrentStepIndex(currentStepIndex + 1);
        } else {
          clearInterval(interval);
          setIsRunning(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, paused, currentStepIndex, steps]);

  return (
    <div className="SimulationControl">
      <div className="Controls">
        <button onClick={handleStart}>Старт</button>
        <button onClick={handlePause}>{paused ? "Продовжити" : "Пауза"}</button>
        <button onClick={handleStepBack}>Крок назад</button>
      </div>
    </div>
  );
};

export default SimulationControl;
