import React, { useEffect, useState } from 'react';
import Graph1 from './Graph1.js';
import Graph2 from './Graph2.js';



const IntegratedGraph = () => {
    const [graphData, setGraphData] = useState(null);

    const [showGraph, setShowGraph] = useState(true);




    const handleToggleGraph1 = () => {
        setShowGraph(true);
    };

    const handleToggleGraph2 = () => {
        setShowGraph(false);
    };


    const handleTransferData = () => {
        if (graphData) {
            // Perform data transformation and create graph2
            const graph2 = {
                nodes: graphData.nodes.map((node) => ({
                    ...node,
                    description: `Description for ${node.name}`,
                })),
                links: graphData.links.map((link) => ({ ...link, color: 'blue' })),
            };

            // Update the graph data
            setGraphData(graph2);
        }
    };

    // Trigger the data transfer when the component mounts
    useEffect(() => {
        handleTransferData();
    }, []); // Empty dependency array if you want the effect to run only once


    return (
        <div>
            <button onClick={handleToggleGraph1}>Toggle Graph 1</button>
            <button onClick={handleToggleGraph2}>Toggle Graph 2</button>
            {showGraph ? (
                <div>
                    <h1>Graph 1</h1>
                    <Graph1 id="Graph1"

                     />
                </div>
            ) : (
                <div>

                    <h1>Graph 2</h1>
                    <Graph2 id="Graph2"

                    />
                </div>

            )}

        </div>
    );

};

export default IntegratedGraph;


