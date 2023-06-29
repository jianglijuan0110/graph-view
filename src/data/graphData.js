const graphData  = {
    nodes: [
        { id: 'node_literal', label : 'literal' },
        { id: 'node_ressource', label : 'ressource'},

        { id: 'node_indiv_LJ', label: 'jiang_lijuan' },
        { id: 'node_lijuan', label: 'Lijuan' },
        { id: 'node_JIANG', label: 'JIANG' },
        { id: 'node_person', label: 'Person' },


        { id: 'node_univ_UM', label: 'univ_montpellier'},
        { id: 'node_organization', label: 'Organization' },
        { id: 'node_nameU', label : 'Université de Montpellier' },
    ],
    links: [
        { source: 'node_indiv_LJ', label: 'rdf:type', target: 'node_person' },
        { source: 'node_indiv_LJ', label: 'firstName', target: 'node_lijuan' },
        { source: 'node_indiv_LJ', label: 'familyName', target: 'node_JIANG' },
        { source: 'node_indiv_LJ', label: 'studiesIn', target: 'node_univ_UM' },

        {source:'node_indiv_LJ' , label: 'rdf:type',  target: 'node_ressource'},

        {source:'node_JIANG' , label: 'rdf:type',  target: 'node_literal'},
        {source:'node_lijuan' , label: 'rdf:type',  target: 'node_literal'},
        {source:'node_person' , label: 'rdf:type',  target: 'node_literal'},


        {source:'node_univ_UM' , label: 'rdf:type',  target: 'node_ressource'},

        { source: 'node_univ_UM', label: 'rdf:type', target: 'node_organization' },
        { source: 'node_univ_UM', label: 'foaf:name', target: 'node_nameU' },


        {source:'node_organization' , label: 'rdf:type',  target: 'node_literal'},
        {source:'node_nameU' , label: 'rdf:type',  target: 'node_literal'},

    ],
};
export default graphData;
