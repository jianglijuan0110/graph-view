import React, { useEffect, useState, useRef } from 'react';
import { Graph } from 'react-d3-graph';
import { Popover } from 'react-bootstrap';
import './Graph1.css';

/**
 * Component representing a graph.
 * @returns {JSX.Element} Graph1 component.
 */
const Graph1 = () => {
    const [showDirection, setShowDirection] = useState(true);
    const [showTooltip, setShowTooltip] = useState(false);
    const [currentNode, setCurrentNode] = useState(null);
    const [currentLink, setCurrentLink] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const graphRef = useRef(null);
    const popoverNodeRef = useRef(null);
    const popoverLinkRef = useRef(null);

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

    /**
     * Configuration object for the graph.
     * @type {Object}
     */
    const graph1Config = {
        nodeHighlightBehavior: true,
        renderLabel: true,
        directed: showDirection, // Use the showDirection state here
        node: {
            color: 'lightgreen',
            size: 120,
            highlightStrokeColor: 'blue',
        },
        link: {
            highlightColor: 'lightblue',
            renderlabel: true,
        },
    };

    /**
     * Toggle the direction of the graph.
     * Updates the showDirection state.
     * @returns {void}
     */
        //the setShowDirection function is called with a callback function that takes the current value of
        // showDirection and returns the new state value by inverting it using the ! (logical NOT) operator.
    const toggleDirection = () => {
            setShowDirection(showDirection => !showDirection);
        };

    useEffect(() => {
        // Simulate data fetching with a delay
        const fetchData = setTimeout(() => {
            const newData = {
                nodes: [
                    { id: 'indiv_LJ', label: 'lj', color: 'red', size: 600 },
                    { id: 'lijuan', label: 'firstName' },
                    { id: 'JIANG', label: 'familyName' },
                    { id: 'person', label: 'p' },
                    { id: 'univ_UM', label: 'university', color: 'orange', size: 400 },
                    { id: 'organization', label: 'o' },
                    { id: 'Université de Montpellier', label: 'nameU' },
                ],
                links: [
                    { source: 'indiv_LJ', label: 'studiesIn', target: 'univ_UM' },
                    { source: 'indiv_LJ', label: 'firstName', target: 'lijuan' },
                    { source: 'indiv_LJ', label: 'familyName', target: 'JIANG' },
                    { source: 'indiv_LJ', label: 'rdf:type', target: 'person' },
                    { source: 'univ_UM', label: 'rdf:type', target: 'organization' },
                    { source: 'univ_UM', label: 'foaf:name', target: 'Université de Montpellier' },
                ],
            };

            setData(newData);
        }, 0);

        return () => {
            // Clean up the setTimeout when the component is unmounted
            clearTimeout(fetchData);
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

    const handleOutsideClick = () => {
        setShowTooltip(false);
        setCurrentNode(null);
        setCurrentLink(null);
    };

    //  // Hide popovers when clicking outside the graph
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);


    // the popoverNode variable is declared outside the RenderNodePop component.
    // This works because the popoverNode variable is a constant and does not depend on
    // any component state or props. It is defined outside the component's scope and can be
    // accessed within the component due to lexical scoping.
    const popoverNode = (
        <Popover id={currentNode} flip={false}>
            <Popover.Header as="h3">{currentNode}</Popover.Header>
            <Popover.Body>{currentNode}</Popover.Body>
        </Popover>
    );

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

    /**
     * Handle link click event.
     * Toggles the tooltip visibility and sets the current link.
     * @param {string} source - ID of the link's source node.
     * @param {string} target - ID of the link's target node.
     * @param {Event} event - Click event.
     * @returns {void}
     */
    const handleLinkClick = (source, target, event) => {
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
    };

    /**
     * Render popover for link.
     * @returns {JSX.Element} Popover component.
     */
    const RenderLinkPop = () => {
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

    return (
        <div ref={graphRef}>
            <Graph
                id="graph-id"
                data={data}
                config={graph1Config}
                onClickNode={handleNodeClick}
                onClickLink={(source, target, event) =>
                    handleLinkClick(source, target, event)
                }
            />
            <RenderNodePop />
            <RenderLinkPop />
            <button onClick={toggleDirection}>
                {showDirection ? 'Hide Direction' : 'Show Direction'}
            </button>
        </div>
    );
};

export default Graph1;
