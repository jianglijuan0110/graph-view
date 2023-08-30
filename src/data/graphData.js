const graphData  = {
    nodes: [
        { id: '_b0', label: '_b0' },
        { id: 'lit_anonyme', label: '"node-blanc"' },
        { id: 'ex:MDR', label: 'ex:MDR' },
        { id: 'ex:IRD', label: 'ex:IRD' },
        { id: 'ex:ISA', label: 'ex:ISA' },
        { id: 'ex:LJ', label: 'ex:LJ' },
        { id: 'lit_lijuan', label: '"Lijuan"' },
        { id: 'lit_JIANG', label: '"JIANG"' },
        { id: 'foaf:Person', label: 'foaf:Person' },
        { id: 'lit_lili', label: '"lili"' },
        { id: 'lit_comm', label: '"lili est une étudiante de l\'Université de Montpellier"' },

        { id: 'ex:univ_UM', label: 'ex:univ_UM'},
        { id: 'foaf:Organization', label: 'foaf:Organization' },
        { id: 'lit_nameU', label : '"Université de Montpellier"' },

    ],
    links: [
        { source: 'ex:LJ', label: 'rdf:type', target: 'foaf:Person' },
        { source: 'ex:MDR', label: 'rdf:type', target: 'foaf:Person' },
        { source: 'ex:LJ', label: 'rdfs:label', target: 'lit_lili' },
        { source: 'ex:LJ', label: 'rdfs:comment', target: 'lit_comm' },
        { source: '_b0', label: 'rdfs:comment', target: 'lit_anonyme' },

        { source: 'ex:LJ', label: 'foaf:firstName', target: 'lit_lijuan' },
        { source: 'ex:LJ', label: 'foaf:familyName', target: 'lit_JIANG' },
        { source: 'ex:LJ', label: 'ex:studiesIn', target: 'ex:univ_UM' },

        { source: 'ex:univ_UM', label: 'rdf:type', target: 'foaf:Organization' },
        { source: 'ex:univ_UM', label: 'foaf:name', target: 'lit_nameU' },

    ],
};
export default graphData;
