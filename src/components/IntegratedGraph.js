import React, { useState } from 'react';
import Graph1 from './Graph1.js';
import Graph2 from './Graph2.js';
import Graph3 from './Graph3.js';

/**
 * Component representing an integrated graph.
 * @returns {JSX.Element} IntegratedGraph component.
 */
const IntegratedGraph = () => {
    const [showGraph, setShowGraph] = useState(1);

    /**
     * Handle toggle graph 1 event.
     * Sets showGraph state to 1.
     * @returns {void}
     */
    const handleToggleGraph1 = () => {
        setShowGraph(1);
    };

    const handleToggleGraph1Bis = () => {
        setShowGraph(1.5);
    };

    /**
     * Handle toggle graph 2 event.
     * Sets showGraph state to 2.
     * @returns {void}
     */
    const handleToggleGraph2 = () => {
        setShowGraph(2);
    };

    /**
     * Handle toggle graph 3 event.
     * Sets showGraph state to 3.
     * @returns {void}
     */
    const handleToggleGraph3 = () => {
        setShowGraph(3);
    };
    const handleToggleGraph4 = () => {
        setShowGraph(4);
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
            <button onClick={handleToggleGraph1}>Vue 1</button>
            <button onClick={handleToggleGraph2}>Vue 2</button>
            <button onClick={handleToggleGraph3}>Vue 3</button>

            {showGraph === 1 ? (
                <div>
                    <h1>Vue 1</h1>
                    <Graph1 handleTransferData={handleTransferData} />
                </div>

            ): showGraph === 2 ? (
                <div>
                    <h1>Vue 2</h1>
                    <Graph2 graphData={graphData} />
                </div>
            ) :  (
                <div>
                    <h1>Vue 3</h1>
                    <Graph3 graphData={graphData} />
                </div>

            )}

        </div>
    );
};

export default IntegratedGraph;
