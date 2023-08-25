import React, { useEffect, useRef, useState } from 'react';
import { Graph } from 'react-d3-graph';
import graphConfig from "../data/graph2Config"
import '../styles/Graph.css';
import { Popover } from "react-bootstrap";
import { colorList, criteriaList} from './ZoneWindow';
import ZoneWindow from './ZoneWindow';

import {
    getNodeIsolated,
    getSourceNodes,

} from '../utils/graphHelpers';
/**
 * Graph4 component represents a graph visualization with only source nodes and different colors for different RDF types.
 * @component
 */

const Graph4 = () => {
    // Handle file upload event

    /**
     * Graph data state.
     * @type {Object}
     * @property {Array<Object>} nodes - Array of node objects.
     * @property {Array<Object>} links - Array of link objects.
     */
    const [graphData, setData] = useState({
        nodes: [],
        links: [],
    });

    // State variables
    const [transformedData, setTransformedData] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [currentNode, setCurrentNode] = useState(null);
    const [currentLink, setCurrentLink] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedCriteria, setSelectedCriteria] = useState('');

    // Refs
    const graphRef = useRef(null);
    const popoverNodeRef = useRef(null);


    const handleFileUpload = async (uploadedFile) => {
        if (uploadedFile) {
            try {
                const fileContent = await uploadedFile.text();

                const parsedData = JSON.parse(fileContent);
                setData(parsedData);
            } catch (error) {
                console.error('Error processing the uploaded file:', error);
            }
        }
    };
    //console.log(graphData);
    const handleColorChange = (newColorCode) => {
        setSelectedColor(newColorCode);
        console.log("Selected Color:", newColorCode);

        handleDataTransformation();
    };



    const handleCriteriaChange = (newCriteria) => {
        setSelectedCriteria(newCriteria);
        console.log("Selected Criteria:", newCriteria);

    };

    /**
     * Checks if the given link is of type 'rdf:type'.
     *
     * @function
     * @param {Object} link - The link object.
     * @returns {boolean} True if the link is of type 'rdf:type', false otherwise.
     */
    const isTypeRdf = link => {
        return link.label === 'rdf:type';
    };

    /**
     * Gets the RDF type of a given node based on its links.
     *
     * @param {Object} node - The node object.
     * @returns {string|null} The RDF type of the node or null if not found.
     */
    const getRdfType = node => {
        // Create an empty object to store source nodes grouped by target nodes
        const nodesByType = {};

        // Loop through each link in the graph data
        graphData.links.forEach(link => {
            // Check if the link is of type 'rdf:type'
            if (isTypeRdf(link)) {
                // Destructure the source and target nodes from the link
                const { source: sourceNode, target: targetType } = link;

                // If the target node's group doesn't exist, create it
                if (!nodesByType[targetType]) {
                    nodesByType[targetType] = [];
                }

                // Add the source node to the group of the target node
                nodesByType[targetType].push(sourceNode);
            }
        });

        // Loop through the groups created earlier
        for (const [type, sourceNodes] of Object.entries(nodesByType)) {
            // Check if the current node is a source node in any group
            if (sourceNodes.includes(node.id)) {
                return type; // Return the corresponding type
            }
        }

        return null; // If no type is found for the node
    };



    /**
     * Transfers and transforms the graph data.
     * @function
     * @returns {void}
     */


// Trigger the data transformation when the component mounts
    const handleDataTransformation = () => {
        const colorMap = new Map();
        const sourceNodes = getSourceNodes(graphData);
        const updatedNodes = [];
        const updatedLinks = [];

        if (graphData) {
            // Ensure selectedColor is valid
            const validSelectedColor = colorList.includes(selectedColor) ? selectedColor : null;

            // Process each node in the graph data
            for (const node of graphData.nodes) {
                const rdfType = getRdfType(node);

                if (
                    sourceNodes.has(node.id) ||
                    getNodeIsolated(graphData).has(node.id)
                ) {
                    updatedNodes.push(node);
                    if (
                        rdfType === selectedCriteria &&
                        criteriaList.includes(selectedCriteria) &&
                        validSelectedColor // Check against valid selected color
                    ) {
                        node.color = validSelectedColor;
                        colorMap.set(rdfType, validSelectedColor);
                    }
                    else{
                        console.error("Selected color is not valid or not in colorList:", selectedColor);}
                } else {
                    console.error("Selected color is not valid or not in colorList:", selectedColor);
                }
            }

            // Process links in the graph data
            for (const link of graphData.links) {
                // Check if both source and target nodes are in sourceNodes
                if (sourceNodes.has(link.source) && sourceNodes.has(link.target)) {
                    updatedLinks.push(link);
                }
            }
        }

        setTransformedData({
            nodes: updatedNodes,
            links: updatedLinks,
        });
    };



    useEffect(() => {
        // Perform color validation and data transformation here
        if (selectedColor && selectedCriteria && graphData) {
            handleDataTransformation();
        }
    }, [selectedColor, selectedCriteria, graphData]);



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
         * Gets the links connected to the given current node.
         *
         * @function
         * @param {Object} graphData - The graph data containing nodes and links.
         * @param {string} currentNode - The ID of the current node.
         * @returns {Array} Array of links connected to the current node.
         */
        const getConnectedLinks = (graphData, currentNode) => {
            const sourceNodes = getSourceNodes(graphData);

            return graphData.links.filter(link =>
                link.source === currentNode && !sourceNodes.has(link.target)
            );
        };

        /**
         * Gets the labels of connected nodes for the given link.
         *
         * @function
         * @param {Object} link - The link object.
         * @param {Object} graphData - The graph data containing nodes and links.
         * @returns {Array} Array of labels of connected nodes.
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
         * Generates information about connected links for the current node.
         *
         * @function
         * @returns {Array} Array of JSX elements representing connected link information.
         */
        const getConnectedLinksInfo = () => {
            const connectedLinks = getConnectedLinks(graphData, currentNode);

            return connectedLinks.map(link => (
                <p key={link.id}>
                    <strong>{link.label}</strong> : {getConnectedNodeLabels(link, graphData).join(', ')}
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

        <div className="graph-page">
            <div className="graph-container">
                {transformedData && (
                    <Graph
                        id="Graph4"
                        data={transformedData}
                        config={graphConfig}
                        onClickNode={handleNodeClick}

                    />
                )}

                <RenderNodePop />
            </div>

            <div className="zone-window-container">
                <ZoneWindow
                    handleFileUpload={handleFileUpload}
                    handleColorChange={handleColorChange}
                    handleCriteriaChange={handleCriteriaChange}

                />

            </div>
        </div>
        </div>
    );
};

export default Graph4;
