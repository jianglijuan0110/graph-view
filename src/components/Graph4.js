import React, { useEffect, useRef, useState } from 'react';
import { Graph } from 'react-d3-graph';
import graphConfig from "../data/graph2Config"
import '../styles/Graph.css';
import { Popover } from "react-bootstrap";
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


    /**
     * Holds a list of criteria extracted from rdf:type relationships.
     * @type {string[]}
     */
    const [criteriaList, setCriteriaList] = useState([]);

    /**
     * Represents the selected color for a criteria.
     * @type {string}
     */
    const [selectedColor, setSelectedColor] = useState('');

    /**
     * Represents the currently selected criteria.
     * @type {string}
     */
    const [selectedCriteria, setSelectedCriteria] = useState('');

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
     * Handles the uploaded file content and updates the graph data state.
     *
     * @param {File} uploadedFile - The uploaded file.
     * @returns {void}
     */
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

    /**
     * Checks if a given link represents an 'rdf:type' relationship.
     *
     * @param {Object} link - The link object to check.
     * @returns {boolean} Returns true if the link represents an 'rdf:type' relationship, otherwise false.
     */
    const isTypeRdf = link => {
        return link.label === 'rdf:type';
    };

    /**
     * Retrieves the rdf:type of a given node from the graph data.
     *
     * @param {Object} node - The node for which to retrieve the rdf:type.
     * @returns {string|null} Returns the rdf:type of the node if found, or null if not found.
     */
    const getRdfType = node => {
        // Find the link with label 'rdf:type' that has the current node as source
        const rdfTypeLink = graphData.links.find(link => link.source === node.id && isTypeRdf(link));

        if (rdfTypeLink) {
            const targetType = rdfTypeLink.target;
            return targetType;
        }

        return null; // If no type is found for the node
    };

    /**
     * Extracts criteria list based on rdf:type relationships from the graph data.
     *
     * @param {Object} graphData - The graph data containing nodes and links.
     * @returns {void}
     */
    useEffect(() => {
        if (graphData) {
            const nodesByType = {};

            graphData.links.forEach(link => {
                if (isTypeRdf(link)) {
                    const { source: sourceNode, target: targetType } = link;

                    if (!nodesByType[targetType]) {
                        nodesByType[targetType] = [];
                    }

                    nodesByType[targetType].push(sourceNode);
                }
            });

            const extractedCriteriaList = Object.keys(nodesByType);
            setCriteriaList(extractedCriteriaList);
        }
    }, [graphData]);



    /**
     * Handles the color change event and updates the selected color state.
     *
     * @param {string} newColorCode - The new color code selected.
     * @returns {void}
     */
    const handleColorChange = (newColorCode) => {
        setSelectedColor(newColorCode);
        handleDataTransformation();
    };

    /**
     * Handles the criteria change event and updates the selected criteria state.
     *
     * @param {string} newCriteria - The new criteria selected.
     * @returns {void}
     */
    const handleCriteriaChange = (newCriteria) => {
        setSelectedCriteria(newCriteria);
    };

    /**
     * Transforms the graph data based on selected criteria and color, updating the transformed data state.
     *
     * @function
     * @returns {void}
     */
    const handleDataTransformation = () => {
        // Create a map to store color associations with RDF types
        const colorMap = new Map();

        // Get source nodes and initialize arrays to store updated nodes and links
        const sourceNodes = getSourceNodes(graphData);
        const updatedNodes = [];
        const updatedLinks = [];

        // Proceed only if there is graph data available
        if (graphData) {
            // Process each node in the graph data
            for (const node of graphData.nodes) {
                const rdfType = getRdfType(node);

                // Check if the node is a source node or isolated node
                if (sourceNodes.has(node.id) || getNodeIsolated(graphData).has(node.id)) {
                    updatedNodes.push(node);

                    // Check if the node meets the selected criteria and color conditions
                    if (rdfType === selectedCriteria && criteriaList.includes(selectedCriteria)) {
                        if (selectedColor) {
                            // Apply the selected color to the node and update colorMap
                            node.color = selectedColor;
                            colorMap.set(rdfType, selectedColor);
                        }
                        else {
                            // Set the color of nodes that meet criteria but lack color to gray
                            node.color = 'gray';
                        }
                    } else {
                        // Set the color of nodes that don't meet criteria or color conditions to gray
                        node.color = 'gray';
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
        }

        // Update the transformed data state with updated nodes and links
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
    }, );



    useEffect(() => {
        // Simulate data fetching with a delay
        const fetchData = setTimeout(() => {
            setData(graphData);
        }, 0);

        return () => {
            // Clean up the setTimeout when the component is unmounted
            clearTimeout(fetchData);
        };
    }, );



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
        }, );

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

        <div ref={graphRef}
             style={{ border: '1px solid black' }}>
            <div className="graph-page">
                <div className="graph-container">
                    {transformedData  &&(
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
                        criteriaList={criteriaList} // criteriaList as prop

                    />

                </div>
            </div>
        </div>
    );
};

export default Graph4;
