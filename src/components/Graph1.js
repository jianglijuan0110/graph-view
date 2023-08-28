import React, { useEffect, useState, useRef } from 'react';
import { Graph } from 'react-d3-graph';
import { Popover } from 'react-bootstrap';
import '../styles/Graph.css';

//import graphData from "../data/marvel/marvel.data"
//import graphConfig from "../data/marvel/marvel.config"

import graphData from "../data/graphData";
import graphConfig from "../data/graph1Config";

import {
    getNodeTargetRdf,
    getNodeLiterals,
    getSourceNodes,
} from '../utils/graphHelpers';

/**
 * Component representing a graph.
 * @returns {JSX.Element} Graph1 component.
 */
const Graph1 = () => {

    // Component state and hooks initialization
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
     * Get a set of nodes that can be reached in the graph.
     *
     * @param {Object} graphData - The graph data containing nodes and links.
     * @returns {Set} - A set of node IDs that can be reached.
     */
    const getReachableNodes = (graphData) => {
        const sourceNodes = getSourceNodes(graphData); // Get source nodes
        const targetRdfTypeNodes = getNodeTargetRdf(graphData); // Get 'rdf:type' target nodes
        const nodesLit = getNodeLiterals(graphData, sourceNodes, targetRdfTypeNodes); // Get literal nodes

        const reachableNodes = new Set([...sourceNodes, ...targetRdfTypeNodes]); // Initialize with source and target nodes

        graphData.nodes.forEach(node => {
            if (!reachableNodes.has(node.id) && !nodesLit.has(node.id)) {
                reachableNodes.add(node.id); // Add nodes reachable through other nodes
            }
        });
        //   console.log("reachableNodes:", reachableNodes);

        return reachableNodes;


    };


    /**
     * Determines the shape of a node based on the provided nodesNotLiteral set.
     *
     * @param {Object} node - The node for which to determine the shape.
     * @param {Set} nodesNotLiteral - A set of nodes that are not literal.
     * @returns {string} - The shape of the node ("circle" or "square").
     */
    const shapeForNode = (node, nodesNotLiteral) => {
        if (nodesNotLiteral.has(node.id)) {
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
        // Get nodes for which shape should be circle
        const nodesNotLiteral = getReachableNodes(graphData);
        //console.log("nodecircle", nodesNotLiteral);

        // Arrays to store updated nodes and links
        const updatedNodes = [];
        const updatedLinks = [];

        if (graphData) {
            // Iterate through nodes to update shapes
            for (const node of graphData.nodes) {
                // Transform the node with updated shape
                const transformedNode = {
                    ...node,
                    symbolType: shapeForNode(node, nodesNotLiteral), // Pass nodesNotLiteral to shapeForNode
                };

                // Add the transformed node to the updatedNodes array
                updatedNodes.push(transformedNode);
            }

            // Iterate through links to update links
            for (const link of graphData.links) {
                const sourceNode = updatedNodes.find(node => node.id === link.source);
                const targetNode = updatedNodes.find(node => node.id === link.target);

                if (sourceNode && targetNode) {
                    // Add the link to the updatedLinks array
                    updatedLinks.push(link);
                }
            }
        }

        // Set the transformed data state with updated nodes and links
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

    /**
     * Effect to hide popovers when clicking outside the graph.
     */
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    /**
     * Handle node click event.
     * Toggles the tooltip visibility and sets the current node.
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
     * Render popover for node.
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
        <div style={{ border: '1px solid black' }}>

            <div ref={graphRef}>
                {transformedData && (
                    <Graph
                        id="Graph1"
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


export default Graph1;
