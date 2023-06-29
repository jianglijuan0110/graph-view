import React, { useEffect, useRef, useState } from 'react';
import { Popover } from 'react-bootstrap';

import { useGraphState } from './GraphState';



const RenderNodePop = () => {
    const {
        showTooltip,
        currentNode,
        setTooltipPosition,
        popoverNodeRef,
        tooltipPosition,
    } = useGraphState();

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
/**
 * Handle link click event.
 * Toggles the tooltip visibility and sets the current link.
 * @param {string} source - ID of the link's source node.
 * @param {string} target - ID of the link's target node.
 * @param {Event} event - Click event.
 * @returns {void}
 */
const RenderLinkPop = () => {
    const {
        showTooltip,
        currentLink,
        setTooltipPosition,
        popoverLinkRef,
        tooltipPosition,
    } = useGraphState();

    useEffect(() => {
        if (showTooltip && currentLink && popoverLinkRef.current) {
            const linkElement = document.getElementById(currentLink);
            const linkRect = linkElement.getBoundingClientRect();
            const popoverRect = popoverLinkRef.current.getBoundingClientRect();

            const xPos = linkRect.right + 10;
            const yPos =
                linkRect.top + linkRect.height / 2 - popoverRect.height / 2;

            setTooltipPosition({ x: xPos, y: yPos });
        }
    }, []);

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

export { RenderNodePop, RenderLinkPop };
