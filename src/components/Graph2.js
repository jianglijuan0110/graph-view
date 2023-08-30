import React, { useEffect, useRef, useState } from 'react';
import { Graph } from 'react-d3-graph';
import graphData from '../data/graphData';
import graphConfig from "../data/graph2Config"
import '../styles/Graph.css';
import { Popover } from "react-bootstrap";

import {
    splitLabel,
    getNodeIsolated,
    getNodeTargetRdf,
    getNodeLiterals,
    getSourceNodes,

} from '../utils/graphHelpers';

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
    /**
     * Represents the transformed data for the graph.
     * @type {Object|null}
     */
    const [transformedData, setTransformedData] = useState(null);

    /**
     * Determines whether the tooltip should be displayed.
     * @type {boolean}
     */
    const [showTooltip, setShowTooltip] = useState(false);

    /**
     * Represents the currently selected node for displaying tooltip.
     * @type {Object|null}
     */
    const [currentNode, setCurrentNode] = useState(null);

    /**
     * Stores the position coordinates (x, y) for displaying the tooltip.
     * @type {{ x: number, y: number }}
     */
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

// Refs
    /**
     * Ref to the graph element in the DOM.
     * @type {React.RefObject}
     */
    const graphRef = useRef(null);

    /**
     * Ref to the node element in the DOM that the popover tooltip is attached to.
     * @type {React.RefObject}
     */
    const popoverNodeRef = useRef(null);

    /**
     * An array containing predefined color codes for visual elements.
     * These colors can be used for representing various data elements in the UI.
     * @type {string[]}
     */
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
     * Get a set of nodes that can be reached in the graph.
     *
     * @param {Object} graphData - The graph data containing nodes and links.
     * @returns {Set} - A set of node IDs that can be reached.
     */
    const getReachableNodes = (graphData) => {
        const sourceNodes = getSourceNodes(graphData); // Get source nodes
        const targetRdfTypeNodes = getNodeTargetRdf(graphData); // Get 'rdf:type' target nodes
        const nodesLiterals = getNodeLiterals(graphData, sourceNodes, targetRdfTypeNodes); // Get literal nodes
        const nodesIsolated = getNodeIsolated(graphData);
        const reachableNodes = new Set([...sourceNodes, ...targetRdfTypeNodes, ...nodesIsolated]); // Initialize with source, target RDF type nodes, and isolated nodes

        graphData.nodes.forEach(node => {
            if (!reachableNodes.has(node.id) && !nodesLiterals.has(node.id)) {
                reachableNodes.add(node.id); // Add nodes reachable through other nodes
            }
        });

        return reachableNodes;
    };



    /**
     * Transfers and transforms the graph data.
     * @function
     * @returns {void}
     */
    const handleDataTransformation = () => {
        const updatedNodes = [];
        const updatedLinks = [];
        const nodesForTransformation = getReachableNodes(graphData);

        const colorMap = new Map(); // Store assigned colors for each node ID

        // Process graph data if available
        if (graphData) {
            // Process each node in the graph data
            for (const node of graphData.nodes) {
                // Check if the node's ID is present in nodesForTransformation
                if (nodesForTransformation.has(node.id)) {
                    updatedNodes.push(node);

                    let assignedColor = colorMap.get(node.id);

                    if (!assignedColor) {
                        const colorIndex = updatedNodes.length - 1;
                        if (colorIndex < colorData.length) {
                            const { prefix } = splitLabel(node.label);
                            if (prefix) {
                                const existingColor = colorMap.get(prefix);
                                if (existingColor) {
                                    assignedColor = existingColor;
                                } else {
                                    assignedColor = colorData[colorIndex];
                                    colorMap.set(prefix, assignedColor);
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
            // Check if both source and target nodes are in nodesForTransformation
            if (nodesForTransformation.has(link.source) && nodesForTransformation.has(link.target)) {
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
         * Retrieves links that are connected to the specified currentNode and not connected to any reachable source node.
         *
         * @param {Object} graphData - The graph data containing nodes and links.
         * @param {string} currentNode - The ID of the current node.
         * @returns {Array<Object>} An array of link objects connected to the currentNode.
         */
        const getConnectedLinks = (graphData, currentNode) => {
            const reachableNodes = getReachableNodes(graphData);

            return graphData.links.filter(link =>
                link.source === currentNode && !reachableNodes.has(link.target)
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
            const reachableNodes = getReachableNodes(graphData);

            const connectedNodeIds = [link.target]
                .filter(targetNodeId => !reachableNodes.has(targetNodeId));

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
        <div style={{ border: '1px solid black' }}>

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
        </div>
    );
};

export default Graph2;
