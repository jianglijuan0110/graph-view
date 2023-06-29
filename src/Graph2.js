import React, { useEffect, useRef, useState } from 'react';
import { Graph } from 'react-d3-graph';
import graphData from './data/graphData';
import graphConfig from "./graph2Config"
import './Graph.css';
import { Popover } from "react-bootstrap";

/**
 * Graph2 component represents a graph visualization.
 * @component
 */
const Graph2 = () => {

    /**
     * Graph data state.
     * @type {Object}
     * @property {Array<Object>} nodes - Array of node objects.
     * @property {Array<Object>} links - Array of link objects.
     */
    const [data, setData] = useState({
        nodes: [],
        links: [],
    });

    // State variables
    const [transformedData, setTransformedData] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [currentNode, setCurrentNode] = useState(null);
    const [currentLink, setCurrentLink] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Refs
    const graphRef = useRef(null);
    const popoverNodeRef = useRef(null);

    /**
     * Transfers and transforms the graph data.
     * @function
     * @returns {void}
     */
    const handleTransferData = () => {
        if (graphData) {
            // Perform data transformation and create graph2
            const transformedGraphData = {
                nodes: graphData.nodes.map((node) => ({
                    ...node,
                    description: `Description for ${node.label}`,
                })),
                links: graphData.links.map((link) => ({ ...link, color: 'blue' })),
            };

            // Update the graph data
            setTransformedData(transformedGraphData);
        }
    };

    // Trigger the data transfer when the component mounts
    useEffect(() => {
        handleTransferData();
    }, [graphData]); // Empty dependency array if you want the effect to run only once

    useEffect(() => {
        // Simulate data fetching with a delay
        const fetchData = setTimeout(() => {
            setData(graphData);
        }, 0);

        return () => {
            // Clean up the setTimeout when the component is unmounted
            clearTimeout(fetchData);
        };
    }, []);

    /**
     * Handles outside click to hide popovers.
     * @function
     * @returns {void}
     */
    const handleOutsideClick = () => {
        setShowTooltip(false);
        setCurrentNode(null);
        setCurrentLink(null);
    };

    // Hide popovers when clicking outside the graph
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    /**
     * Handles node click event.
     * @function
     * @param {string} nodeId - ID of the clicked node.
     * @param {Event} event - Click event.
     * @returns {void}
     */
    const handleNodeClick = (nodeId, event) => {
        if (!event) return;
        const { clientX, clientY } = event;
        if (currentNode && showTooltip) {
            setShowTooltip(false);
            setCurrentNode(null);
        } else {
            setShowTooltip(true);
            setCurrentNode(nodeId);
            setCurrentLink(null); // Reset currentLink when a node is clicked
            setTooltipPosition({ x: clientX, y: clientY });
        }
    };

    /**
     * Renders popover for the clicked node.
     * @function
     * @returns {JSX.Element} Popover component.
     */
    const RenderNodePop = () => {
        useEffect(() => {
            if (showTooltip && currentNode && popoverNodeRef.current) {
                const nodeElement = document.getElementById(currentNode);
                const nodeRect = nodeElement.getBoundingClientRect();
                const popoverRect = popoverNodeRef.current.getBoundingClientRect();

                const xPos = nodeRect.right + 10;
                const yPos =
                    nodeRect.top + nodeRect.height / 2 - popoverRect.height / 2;

                setTooltipPosition({ x: xPos, y: yPos });
            }
        }, []);

        /**
         * Popover for the clicked node.
         * @type {JSX.Element}
         */
        const popoverNode = (
            <Popover id={currentNode} flip={false}>
                <Popover.Header as="h3">id : {currentNode}</Popover.Header>
                <Popover.Body></Popover.Body>
            </Popover>
        );

        return (
            <div>
                {showTooltip && currentNode && (
                    <div
                        className="custom-popover"
                        style={{
                            top: tooltipPosition.y,
                            left: tooltipPosition.x,
                        }}
                        ref={popoverNodeRef}
                    >
                        {popoverNode}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div ref={graphRef} className="graph-container">
            <Graph
                id="Graph2"
                data={data}
                config={graphConfig}
                onClickNode={handleNodeClick}
            />
            <RenderNodePop />
        </div>
    );
};

export default Graph2;
