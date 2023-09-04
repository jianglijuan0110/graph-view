/**
 * Configuration object for the graph.
 * @type {Object}
 */

//let showDirection = true;
module.exports = {
    automaticRearrangeAfterDropNode: false,
    collapsible: false,
    height: 400,
    highlightDegree: 1,
    highlightOpacity: 0.2,
    linkHighlightBehavior: true,
    maxZoom: 8,
    minZoom: 0.1,
    nodeHighlightBehavior: true,
    panAndZoom: false,
    staticGraph: false,
    width: 800,
    directed: true,

    renderLabel: true,
    //directed: showDirection,
    node: {

        color: 'lightgreen',
        fontColor: "black",
        fontSize: 16,
        fontWeight: "normal",
        highlightColor: "red",
        highlightFontSize: 12,
        highlightFontWeight: "bold",
        highlightStrokeColor: "SAME",
        highlightStrokeWidth: 1.5,
        labelProperty: "label",
        mouseCursor: "pointer",
        opacity: 1,
        renderLabel: true,
        size: 450,
        strokeColor: "none",
        strokeWidth: 1.5,
        svg: "",
        //symbolType: "circle",
    },
    link: {

        highlightColor: 'lightblue',

        color: "#d3d3d3",
        fontColor: "red",
        fontSize: 14,
        //highlightColor: "blue",
        highlightFontWeight: "bold",
        //labelProperty: link => `from ${link.source} to ${link.target}`,
        labelProperty: "label",
        renderLabel: true,
        opacity: 1,

        semanticStrokeWidth: false,
        strokeWidth: 4,
    },

    /*setShowDirection: (value) => {
        showDirection = value;
    },*/

    d3: {
        gravity: -400,
        linkLength: 300,
    },
};
