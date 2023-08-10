import React, { useEffect, useRef, useState } from 'react';
import { Graph } from 'react-d3-graph';
import graphData from '../data/graphData';
import graphConfig from "../data/graph2Config"
import '../styles/Graph.css';
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

    const colorForNode = node => {
        if (node.label.includes('foaf')) {
            return "blue";
        } else if (node.label.startsWith('_')) {
            return "green";
        } else if (node.label.includes(':')) {
            return "red";
        } else if (node.id.includes('lit')) {
            return "gray";
        }
    };

    const shapeForNode = node => {
        if (node.label.includes(':') || node.label.startsWith('_')) {
            return "circle"; // Resource node
        } else {
            return "square"; // Literal node
        }
    };

    /**
     * Transfers and transforms the graph data.
     * @function
     * @returns {void}
     */
    const handleDataTransformation = () => {
        const updatedNodes = [];
        const updatedLinks = [];

        if (graphData) {
            for (const node of graphData.nodes) {
                const transformedNode = {
                    ...node,
                    shape: shapeForNode(node),
                    color: colorForNode(node),

                };

                if (transformedNode.shape !== "square") {
                    updatedNodes.push(transformedNode);
                }
                else {
                    // If it's a square node, find connected circle nodes and add information
                    const connectedCircleNodes = updatedNodes.filter(
                        n => n.shape === "circle" && graphData.links.some(link => link.source === n.id && link.target === transformedNode.id)
                    );

                    for (const circleNode of connectedCircleNodes) {
                        circleNode.popup += `Square Node Information: ${transformedNode.label}\n`;
                    }
                }
            }

            for (const link of graphData.links) {
                const sourceNode = updatedNodes.find(node => node.id === link.source);
                const targetNode = updatedNodes.find(node => node.id === link.target);

                if (sourceNode && targetNode) {
                    // Check if the source node's id includes "lit"
                    if (!sourceNode.id.includes('lit')) { // A node literal cannot serve as a node source.
                        if (sourceNode.shape === "circle" && targetNode.shape === "square") {
                            // Transfer the link information to circle node
                        } else {
                            updatedLinks.push(link);
                        }
                    }
                }
            }

        }

        setTransformedData({
            nodes: updatedNodes,
            links: updatedLinks,
        });
    };

    // Trigger the data transfer when the component mounts
    useEffect(() => {
        handleDataTransformation();
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

        const getConnectedLinksInfo = () => {
            const connectedLinks = getConnectedLinks();

            return connectedLinks.map(link => (
                <p >
                    <strong>{link.label}</strong> {getConnectedNodeLabels(link)}
                </p>
            ));
        };

        const getConnectedLinks = () => {
            return graphData.links.filter(
                link => link.source === currentNode
            );
        };

        const getConnectedNodeLabels = link => {
            const connectedNodeIds = [link.target];
            const connectedLabels = connectedNodeIds.map(nodeId => {
                const node = graphData.nodes.find(node => node.id === nodeId);
                return node ? `:${node.label}`: null;
            });

            return connectedLabels.filter(label => label !== null);
        };

        /**
         * Popover for the clicked node.
         * @type {JSX.Element}
         */
        const popoverNode = (
            <Popover id={currentNode} flip={false}>
                <Popover.Header as="h3">id : {currentNode}</Popover.Header>
                <Popover.Body>{getConnectedLinksInfo()}</Popover.Body>
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
            {transformedData && ( // Data is conditionally rendered
                <Graph
                    id="Graph2"
                    data={transformedData}
                    config={graphConfig}
                    onClickNode={handleNodeClick}
                />
            )}
            <RenderNodePop />
        </div>
    );
};

export default Graph2;
