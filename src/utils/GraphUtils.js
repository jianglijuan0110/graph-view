import {useEffect, useState} from 'react';
/**
 * Handle node click event.
 * Toggles the tooltip visibility and sets the current node.
 * @param {string} nodeId - ID of the clicked node.
 * @param {Event} event - Click event.
 * @returns {void}
 */
export const handleNodeClick = (nodeId, event,currentNode,showTooltip,setShowTooltip,setCurrentNode,setCurrentLink,setTooltipPosition) => {

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



export const handleLinkClick = (source, target, event,currentLink,showTooltip,setShowTooltip,setCurrentLink,setTooltipPosition) => {
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
export const handleOutsideClick = (setShowTooltip, setCurrentNode, setCurrentLink) => {
    setShowTooltip(false);
    setCurrentNode(null);
    setCurrentLink(null);
};

