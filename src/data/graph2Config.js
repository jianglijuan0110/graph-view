/**
 * Configuration object for the graph.
 * @type {Object}
 */
module.exports = {
    nodeHighlightBehavior: true,
    renderLabel: true,
    directed: true,
    height: 400,
    width: 800,
    automaticRearrangeAfterDropNode: false,
    collapsible: false,
    highlightDegree: 1,
    highlightOpacity: 0.2,
    linkHighlightBehavior: true,
    maxZoom: 8,
    minZoom: 0.1,
    panAndZoom: false,
    staticGraph: false,
    node: {
        color: 'lightgreen',
        size: 420,
        labelProperty: "label",
        renderLabel: true,
        fontSize: 16,
        fontColor: "black",
        fontWeight: "normal",
       highlightColor: "red",
        highlightFontSize: 12,
        highlightFontWeight: "bold", //change color of node when mouse over link
    },
    link: {
        highlightColor: 'lightblue',
        highlightFontWeight: "bold",
        fontColor: "red",
        fontSize: 14, // size for label text
        strokeWidth: 4, // size for link
        renderLabel: true,
        labelProperty: "label",
        color: "#d3d3d3",
        opacity: 1,
        semanticStrokeWidth: false,
    },
    d3: {// size global for graph
        gravity: -400,
        linkLength: 300,
    },
};
