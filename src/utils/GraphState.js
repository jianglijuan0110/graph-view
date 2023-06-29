import { useState, useRef } from 'react';
/* variables globals */
export const useGraphState = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [currentNode, setCurrentNode] = useState(null);
    const [currentLink, setCurrentLink] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const graphRef = useRef(null);
    const popoverNodeRef = useRef(null);
    const popoverLinkRef = useRef(null);

    return {
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
    };
};
/* example :
* use in the other files
* import { useGraphState } from './GraphState';

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
* */
