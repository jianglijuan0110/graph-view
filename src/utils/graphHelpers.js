
import graphData from "../data/graphData";


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
 * Returns a set of nodes that are source nodes of 'rdf:type' links.
 *
 * @param {Object} graphData - The graph data containing nodes and links.
 * @returns {Set} - A set of 'rdf:type' source node IDs.
 */
export function getNodeSourceRdf(graphData) {
    const sourceRdfTypeNodes = new Set(graphData.links.filter(link => link.label === 'rdf:type').map(link => link.source));
    return sourceRdfTypeNodes;
}

/**
 * Returns a set of nodes that are not connected to 'rdf:type' target nodes.
 *
 * @param {Object} graphData - The graph data containing nodes and links.
 * @param {Set} targetRdfTypeNodes - A set of 'rdf:type' target node IDs.
 * @returns {Set} - A set of nodes not connected to 'rdf:type' targets.
 */
export function getNodeNotRdf(graphData, targetRdfTypeNodes) {
    const nodesNotRdf = new Set(graphData.nodes.filter(node => !targetRdfTypeNodes.has(node.id)).map(node => node.id));
    return nodesNotRdf;
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

/**
 * Returns a set of nodes that are neither 'rdf:type' targets nor literals.
 *
 * @param {Object} graphData - The graph data containing nodes and links.
 * @param {Set} nodesNotRdf - A set of nodes not connected to 'rdf:type' targets.
 * @param {Set} nodesLiterals - A set of literal node IDs.
 * @returns {Set} - A set of nodes that are neither 'rdf:type' targets nor literals.
 */
export function getNodeNotRdfAndNotLiteral(graphData, nodesNotRdf, nodesLiterals) {
    const nodesNotRdfAndNotLiteral = new Set([...nodesNotRdf].filter(nodeId => !nodesLiterals.has(nodeId)));
    return nodesNotRdfAndNotLiteral;
}



/**
 * Returns an array of nodes that are not categorized as literals or 'rdf:type' targets.
 *
 * @param {Object} graphData - The graph data containing nodes and links.
 * @param {Set} nodesLiterals - A set of literal node IDs.
 * @param {Set} isolatedNodes - A set of isolated node IDs.
 * @param {Set} sourceNodes - A set of source node IDs.
 * @param {Set} targetRdfTypeNodes - A set of 'rdf:type' target node IDs.
 * @returns {Array} - An array of node IDs not categorized as literals or 'rdf:type' targets.
 */
export function getNodesRest(graphData, nodesLiterals, isolatedNodes, sourceNodes, targetRdfTypeNodes) {
    const excludedNodes = new Set([...nodesLiterals, ...isolatedNodes, ...sourceNodes, ...targetRdfTypeNodes]);
    const allNodes = new Set(graphData.nodes.map(node => node.id));
    const restNodes = new Set([...allNodes].filter(nodeId => !excludedNodes.has(nodeId)));
    return Array.from(restNodes);
}


/*
// Extract necessary data
    const nodesRdf = getNodeTargetRdf(graphData);
    const sourceNodes = new Set(graphData.links.map(link => link.source));
    const isolatedNodes = getNodeIsolated(graphData);

// Calculate other node categories
    const nodesLiterals = getNodeLiterals(graphData, sourceNodes, nodesRdf);
    const nodesNotRdf = getNodeNotRdf(graphData, nodesRdf);
    const notRdfAndNotLiteralNodes = getNodeNotRdfAndNotLiteral(graphData, nodesNotRdf, nodesLiterals);

// Calculate the final node categories
    const allSourceNodes = getSourceNodes(graphData);
    const restNodes = getNodesRest(graphData, nodesLiterals, isolatedNodes, sourceNodes, nodesRdf);

// Print the results
    console.log("All Source Nodes:", allSourceNodes);
    console.log("Literals:", nodesLiterals);
    console.log("No RDF Nodes:", nodesNotRdf);
    console.log("Nodes not RDF and not Literal:", notRdfAndNotLiteralNodes);
    console.log("Node target RDF:", nodesRdf);
    console.log("Nodes Isolated:", isolatedNodes);
    console.log("Rest of the Nodes:", restNodes);

 */
