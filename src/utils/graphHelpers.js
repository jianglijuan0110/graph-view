

/**
 * Retrieves a set of source nodes from the graph data's links.
 *
 * @param {Object} graphData - The graph data containing nodes and links.
 * @returns {Set} Set of source node IDs.
 */
export function getSourceNodes(graphData) {
    return new Set(graphData.links.map(link => link.source));
}


/**
 * Splits a label into parts using a colon as a delimiter.
 *
 * @param {string} label - The label to be split.
 * @returns {Object} - An object containing the parts before and after the colon.
 */
export function splitLabel(label) {
    const parts = label.split(':');
    const prefix = parts[0];
    const suffix = parts[1];
    return { prefix, suffix };
}

/**
 * Returns a set of isolated nodes that are neither source nor target in the graph.
 *
 * @param {Object} graphData - The graph data containing nodes and links.
 * @returns {Set} - A set of isolated node IDs.
 */
export function getNodeIsolated(graphData) {
    const sourceNodes = new Set(graphData.links.map(link => link.source));
    const targetNodes = new Set(graphData.links.map(link => link.target));

    const isolatedNodes = new Set(graphData.nodes.filter(node => {
        const isIsolated = (!node.links || node.links.length === 0);
        const isNotSourceOrTarget = !sourceNodes.has(node.id) && !targetNodes.has(node.id);
        return isIsolated && isNotSourceOrTarget;
    }).map(node => node.id));

    return isolatedNodes;
}

/**
 * Returns a set of nodes that are target nodes of 'rdf:type' links.
 *
 * @param {Object} graphData - The graph data containing nodes and links.
 * @returns {Set} - A set of 'rdf:type' target node IDs.
 */
export function getNodeTargetRdf(graphData) {
    const targetRdfTypeNodes = new Set(graphData.links.filter(link => link.label === 'rdf:type').map(link => link.target));
    return targetRdfTypeNodes;
}


/**
 * Returns a set of nodes that are literal nodes in the graph.
 *
 * @param {Object} graphData - The graph data containing nodes and links.
 * @param {Set} sourceNodes - A set of source node IDs.
 * @param {Set} targetRdfTypeNodes - A set of 'rdf:type' target node IDs.
 * @returns {Set} - A set of literal node IDs.
 */
export function getNodeLiterals(graphData, sourceNodes, targetRdfTypeNodes) {
    const nodesNoRdfTypeOrSource = new Set(graphData.nodes.filter(node => !sourceNodes.has(node.id) && !targetRdfTypeNodes.has(node.id)).map(node => node.id));
    const isolatedNodes = getNodeIsolated(graphData, sourceNodes);
    const nodesLit = new Set([...nodesNoRdfTypeOrSource].filter(nodeId => !isolatedNodes.has(nodeId)));
    return nodesLit;
}











