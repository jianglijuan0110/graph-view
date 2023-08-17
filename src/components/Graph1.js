import React, { useEffect, useState, useRef } from 'react';
import { Graph } from 'react-d3-graph';
import { Popover } from 'react-bootstrap';
import '../styles/Graph.css';

//import graphData from "../data/marvel/marvel.data"
//import graphConfig from "../data/marvel/marvel.config"

import graphData from "../data/graphData";
import graphConfig from "../data/graph1Config";

import {useGraphState} from "../utils/GraphState";


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

    // Other state variables and hooks initialization

    //const [showDirection, setShowDirection] = useState(graphConfig.directed);
    const {
        showTooltip,
        setShowTooltip,
        currentNode,
        setCurrentNode,
        currentLink,
        setCurrentLink,
        tooltipPosition,
        setTooltipPosition,
        graphRef,
        popoverNodeRef,
        popoverLinkRef,
    } = useGraphState();

    const [transformedData, setTransformedData] = useState(null);
    /**
     * Toggle the direction of the graph.
     * Updates the showDirection state.
     * @returns {void}
     */
    //the setShowDirection function is called with a callback function that takes the current value of
    // newShowDirection and returns the new state value by inverting it using the ! (logical NOT) operator.

    /*const toggleDirection = () => {
        const newShowDirection = !showDirection;
        setShowDirection(newShowDirection);
        graphConfig.directed = newShowDirection; // Update the direction in the config file
    };*/


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
     * Determines the shape of a node based on the provided nodeCircle set.
     *
     * @param {Object} node - The node for which to determine the shape.
     * @param {Set} nodeCircle - A set of nodes that should have a "circle" shape.
     * @returns {string} - The shape of the node ("circle" or "square").
     */
    const shapeForNode = (node, nodeCircle) => {
        if (nodeCircle.has(node.id)) {
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
        const nodeCircle = getSourceNodes(graphData);

        // Arrays to store updated nodes and links
        const updatedNodes = [];
        const updatedLinks = [];

        if (graphData) {
            // Iterate through nodes to update shapes
            for (const node of graphData.nodes) {
                // Transform the node with updated shape
                const transformedNode = {
                    ...node,
                    symbolType: shapeForNode(node, nodeCircle), // Pass nodeCircle to shapeForNode
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


    // the popoverNode variable can be declared outside the RenderNodePop component.
    // This works because the popoverNode variable is a constant and does not depend on
    // any component state or props. It is defined outside the component's scope and can be
    // accessed within the component due to lexical scoping.



    /**
     * Handle link click event.
     * Toggles the tooltip visibility and sets the current link.
     * @param {string} source - ID of the link's source node.
     * @param {string} target - ID of the link's target node.
     * @param {Event} event - Click event.
     * @returns {void}
     */
    /* const handleLinkClick = (source, target, event) => {
         if (event) {
             event.stopPropagation();
         }

         if (currentLink === target && showTooltip) {
             setShowTooltip(false);
             setCurrentLink(null);
         } else {
             setShowTooltip(true);
             setCurrentLink(target);
             setTooltipPosition({ x: 0, y: 0 }); // Reset tooltip position to avoid flickering
         }
     };*/

    /**
     * Render popover for link.
     * @returns {JSX.Element} Popover component.
     */
    /* const RenderLinkPop = () => {
         useEffect(() => {
             if (showTooltip && currentLink && popoverLinkRef.current) {
                 // Calculate the position of the popover based on the link's position and size
                 const linkElement = document.getElementById(currentLink);
                 const linkRect = linkElement.getBoundingClientRect();
                 const popoverRect = popoverLinkRef.current.getBoundingClientRect();

                 const xPos = linkRect.right + 10;
                 const yPos = linkRect.top + linkRect.height / 2 - popoverRect.height / 2;

                 setTooltipPosition({ x: xPos, y: yPos });
             }
         }, []);

         //In the case of RenderLinkPop, the popoverLink variable depends on the currentLink value,
         // specifically the source and target values extracted from it. Since the content of the
         // popover is dynamic and based on the currentLink value, it cannot be declared outside
         // the RenderLinkPop component because it needs access to the component's state or props
         const popoverLink = (
             <Popover id={currentLink} flip={false}>
                 <Popover.Header as="h3">Link Details</Popover.Header>
                 <Popover.Body>
                     <p>Source: {currentLink && currentLink.split('-')[0]}</p>
                     <p>Target: {currentLink && currentLink.split('-')[1]}</p>
                 </Popover.Body>
             </Popover>
         );

         return (
             <div>
                 {showTooltip && currentLink && (
                     <div
                         className="custom-popover"
                         style={{
                             top: tooltipPosition.y,
                             left: tooltipPosition.x,
                         }}
                         ref={popoverLinkRef}
                     >
                         {popoverLink}
                     </div>
                 )}
             </div>
         );
     };
 */
    return (
        <div ref={graphRef}>
            {transformedData && (
                <Graph
                    id="Graph1"
                    data={transformedData}
                    config={graphConfig}
                    onClickNode={handleNodeClick}
                    /*onClickLink={(source, target, event) =>
                        handleLinkClick(source, target, event)
                    }*/
                />
            )}
            <RenderNodePop />
            {/*<RenderLinkPop />*/}

            {/*<button onClick={toggleDirection}>
                {showDirection ? 'Hide Direction' : 'Show Direction'}
            </button>*/}
        </div>
    );
};




export default Graph1;
