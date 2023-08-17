import React, { useEffect, useRef, useState } from 'react';
import { Graph } from 'react-d3-graph';
import graphData from '../data/graphData';
import graphConfig from "../data/graph2Config"
import '../styles/Graph.css';
import { Popover } from "react-bootstrap";
/**
 * Graph2 component represents a graph visualization without literal nodes and with different colors.
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
    const colorData = [
        '#0000FF', // Blue
        '#008000', // Green
        '#FF0000', // Red
        '#FFA500', // Orange
        '#800080', // Purple
        '#00FFFF', // Cyan
        '#FF00FF', // Magenta
        '#FFFF00', // Yellow
        '#808080', // Gray
        '#FFC0CB'  // Pink
    ];
    /**
     * Splits a label into parts using a colon as a delimiter.
     *
     * @param {string} label - The label to be split.
     * @returns {Object} - An object containing the parts before and after the colon.
     */
    const splitLabel = label => {
        const parts = label.split(':');
        const beforeColon = parts[0];
        const afterColon = parts[1];
        return { beforeColon, afterColon };
    };

    /**
     * Gets the source nodes based on the links in the graph data.
     *
     * @param {Object} graphData - The graph data containing nodes and links.
     * @returns {Set} - A set of source node IDs.
     */
    const getSourceNodes = (graphData) => {
        const sourceNodes = new Set(graphData.links.map(link => link.source));
        const targetRdfTypeNodes = new Set(graphData.links.filter(link => link.label === 'rdf:type').map(link => link.target));

        targetRdfTypeNodes.forEach(targetRdfTypeNode => sourceNodes.add(targetRdfTypeNode));
        return sourceNodes;
    };

    /**
     * Transfers and transforms the graph data.
     * @function
     * @returns {void}
     */
    const handleDataTransformation = () => {
        const updatedNodes = [];
        const updatedLinks = [];
        const sourceNodes = getSourceNodes(graphData); // Get nodes for which shape should be circle

        const colorMap = new Map(); // Store assigned colors for each node ID

        // Process graph data if available
        if (graphData) {
            // Process each node in the graph data
            for (const node of graphData.nodes) {
                // Check if the node's ID is in sourceNodes
                if (sourceNodes.has(node.id)) {
                    updatedNodes.push(node);

                    let assignedColor = colorMap.get(node.id);

                    if (!assignedColor) {
                        const colorIndex = updatedNodes.length - 1;
                        if (colorIndex < colorData.length) {
                            const { beforeColon } = splitLabel(node.label);
                            if (beforeColon) {
                                const existingColor = colorMap.get(beforeColon);
                                if (existingColor) {
                                    assignedColor = existingColor;
                                } else {
                                    assignedColor = colorData[colorIndex];
                                    colorMap.set(beforeColon, assignedColor);
                                }
                                node.color = assignedColor;
                                colorMap.set(node.id, assignedColor);
                            }
                        }
                    }
                }
            }
        }

        // Process links in the graph data
        for (const link of graphData.links) {
            // Check if both source and target nodes are in sourceNodes
            if (sourceNodes.has(link.source) && sourceNodes.has(link.target)) {
                updatedLinks.push(link);
            }
        }

        // Update the transformed data with the updated nodes and links
        setTransformedData({
            nodes: updatedNodes,
            links: updatedLinks,
        });
    };



// Trigger the data transformation when the component mounts
    useEffect(() => {
        handleDataTransformation();
    }, [graphData]);


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
         * Retrieves links that are connected to the specified currentNode and not connected to any source node.
         *
         * @param {Object} graphData - The graph data containing nodes and links.
         * @param {string} currentNode - The ID of the current node.
         * @returns {Array<Object>} An array of link objects connected to the currentNode.
         */
        const getConnectedLinks = (graphData, currentNode) => {
            const sourceNodes = getSourceNodes(graphData);

            return graphData.links.filter(link =>
                link.source === currentNode && !sourceNodes.has(link.target)
            );
        };

        /**
         * Retrieves labels of connected nodes based on the given link and graph data.
         *
         * @param {Object} link - The link object.
         * @param {Object} graphData - The graph data containing nodes and links.
         * @returns {Array<string>} An array of labels of nodes connected through the given link.
         */
        const getConnectedNodeLabels = (link, graphData) => {
            const sourceNodes = getSourceNodes(graphData);

            const connectedNodeIds = [link.target]
                .filter(targetNodeId => !sourceNodes.has(targetNodeId));

            const connectedLabels = connectedNodeIds.map(nodeId => {
                const node = graphData.nodes.find(n => n.id === nodeId);
                return node ? node.label : null;
            });

            return connectedLabels.filter(label => label !== null);
        };

        /**
         * Generates information about connected links and their connected node labels.
         *
         * @returns {Array<JSX.Element>} An array of JSX elements representing connected link information.
         */
        const getConnectedLinksInfo = () => {
            const connectedLinks = getConnectedLinks(graphData, currentNode);

            return connectedLinks.map(link => (
                <p key={link.id}>
                    <strong>{link.label}</strong> : {getConnectedNodeLabels(link, graphData)}
                </p>
            ));
        };

        /**
         * Popover for the clicked node.
         * @type {JSX.Element}
         */
        const popoverNode = (
            <Popover id={currentNode} flip={false}>
                <Popover.Header as="h3">Node Id : {currentNode}</Popover.Header>
                <Popover.Body>
                    {getConnectedLinksInfo()}
                </Popover.Body>
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
