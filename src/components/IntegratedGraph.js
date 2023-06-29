import React, { useState } from 'react';
import Graph1 from './Graph1.js';
import Graph2 from './Graph2.js';

/**
 * Component representing an integrated graph.
 * @returns {JSX.Element} IntegratedGraph component.
 */
const IntegratedGraph = () => {
    const [showGraph, setShowGraph] = useState(true);

    /**
     * Handle toggle graph 1 event.
     * Sets showGraph state to true.
     * @returns {void}
     */
    const handleToggleGraph1 = () => {
        setShowGraph(true);
    };

    /**
     * Handle toggle graph 2 event.
     * Sets showGraph state to false.
     * @returns {void}
     */
    const handleToggleGraph2 = () => {
        setShowGraph(false);
    };

    const [graphData, setGraphData] = useState({
        nodes: [],
        links: [],
    });

    /**
     * Handle transfer data event.
     * Sets the graphData state with the provided data.
     * @param {Object} graphData - The data to be transferred.
     * @returns {void}
     */
    const handleTransferData = (graphData) => {
        setGraphData(graphData);
    };

    return (
        <div>
            <button onClick={handleToggleGraph1}>Toggle Graph 1</button>
            <button onClick={handleToggleGraph2}>Toggle Graph 2</button>
            {showGraph ? (
                <div>
                    <h1>Graph 1</h1>
                    <Graph1 handleTransferData={handleTransferData} />
                </div>
            ) : (
                <div>
                    <h1>Graph 2</h1>
                    <Graph2 graphData={graphData} />
                </div>
            )}
        </div>
    );
};

export default IntegratedGraph;
