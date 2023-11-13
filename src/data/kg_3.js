const graphData = {
    nodes: [
    { id: "lit_12", label: "Sport , Bien être" },
    { id: "kg_3:dAaCiflDZEc423ulw19y-4", label: "Sentinel 2 " },
    { id: "lit_11", label: "Détection de pistes de ski" },
    { id: "kg_3:dAaCiflDZEc423ulw19y-1", label: "NDSI (Neige)" },
    { id: "kg_3:dAaCiflDZEc423ulw19y-2", label: "Détection de la neige" },
    { id: "kg_3:dAaCiflDZEc423ulw19y-5", label: "B3, B11, B12" },
    { id: "lit_3", label: "Sentinel 2 " },
    { id: "lit_2", label: "Détection de la neige" },
    { id: "kg_3:oSFtW028ciUDl_aVvz35-60", label: "Sport , Bien être" },
    { id: "lit_1", label: "NDSI (Neige)" },
    { id: "lit_7", label: "NDBI(Batiments)" },
    { id: "lit_6", label: "B4,B8" },
    { id: "kg_3:oSFtW028ciUDl_aVvz35-21", label: "B8, B11, B12" },
    { id: "lit_5", label: "B8, B11, B12" },
    { id: "lit_10", label: "Détection du Bati (Stations)" },
    { id: "lit_4", label: "B3, B11, B12" },
    { id: "kg_3:oSFtW028ciUDl_aVvz35-23", label: "B4,B8" },
    { id: "kg_3:oSFtW028ciUDl_aVvz35-45", label: "Détection Végétations (Sapins)" },
    { id: "kg_3:oSFtW028ciUDl_aVvz35-56", label: "Détection de pistes de ski" },
    { id: "kg_3:oSFtW028ciUDl_aVvz35-46", label: "Détection du Bati (Stations)" },
    { id: "kg_3:oSFtW028ciUDl_aVvz35-36", label: "NDBI(Batiments)" },
    { id: "lit_9", label: "Détection Végétations (Sapins)" },
    { id: "kg_3:oSFtW028ciUDl_aVvz35-37", label: "NDVI (Végétation)" },
    { id: "lit_8", label: "NDVI (Végétation)" },
        { id: "ikg:Index", label: "Index" },
        { id: "ikg:Application", label: "Application" },
        { id: "ikg:Instrument", label: "Instrument" },
        { id: "ikg:Bands", label: "Bands" },
        { id: "ikg:Theme", label: "Theme" },




    ],
    links: [
    { source: "kg_3:dAaCiflDZEc423ulw19y-1", label: "rdf:type", target: "ikg:Index" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-1", label: "rdfs:label", target: "lit_1" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-1", label: "ikg:isComputedBy", target: "kg_3:dAaCiflDZEc423ulw19y-5" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-2", label: "rdf:type", target: "ikg:Application" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-2", label: "rdfs:label", target: "lit_2" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-2", label: "ikg:isAnApplicationOf", target: "kg_3:dAaCiflDZEc423ulw19y-1" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-2", label: "ikg:isAnApplicationOf", target: "kg_3:oSFtW028ciUDl_aVvz35-56" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-4", label: "rdf:type", target: "ikg:Instrument" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-4", label: "rdfs:label", target: "lit_3" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-5", label: "rdf:type", target: "ikg:Bands" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-5", label: "rdfs:label", target: "lit_4" },
    { source: "kg_3:dAaCiflDZEc423ulw19y-5", label: "ikg:isObservedBy", target: "kg_3:dAaCiflDZEc423ulw19y-4" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-21", label: "rdf:type", target: "ikg:Bands" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-21", label: "rdfs:label", target: "lit_5" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-21", label: "ikg:isObservedBy", target: "kg_3:dAaCiflDZEc423ulw19y-4" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-23", label: "rdf:type", target: "ikg:Bands" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-23", label: "rdfs:label", target: "lit_6" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-23", label: "ikg:isObservedBy", target: "kg_3:dAaCiflDZEc423ulw19y-4" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-36", label: "rdf:type", target: "ikg:Index" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-36", label: "rdfs:label", target: "lit_7" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-36", label: "ikg:isComputedBy", target: "kg_3:oSFtW028ciUDl_aVvz35-21" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-37", label: "rdf:type", target: "ikg:Index" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-37", label: "rdfs:label", target: "lit_8" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-37", label: "ikg:isComputedBy", target: "kg_3:oSFtW028ciUDl_aVvz35-23" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-45", label: "rdf:type", target: "ikg:Application" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-45", label: "rdfs:label", target: "lit_9" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-45", label: "ikg:isAnApplicationOf", target: "kg_3:oSFtW028ciUDl_aVvz35-37" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-45", label: "ikg:isAnApplicationOf", target: "kg_3:oSFtW028ciUDl_aVvz35-56" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-46", label: "rdf:type", target: "ikg:Application" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-46", label: "rdfs:label", target: "lit_10" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-46", label: "ikg:isAnApplicationOf", target: "kg_3:oSFtW028ciUDl_aVvz35-36" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-46", label: "ikg:isAnApplicationOf", target: "kg_3:oSFtW028ciUDl_aVvz35-56" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-56", label: "rdf:type", target: "ikg:Application" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-56", label: "rdfs:label", target: "lit_11" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-56", label: "ikg:hasTheme", target: "kg_3:oSFtW028ciUDl_aVvz35-60" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-60", label: "rdf:type", target: "ikg:Theme" },
    { source: "kg_3:oSFtW028ciUDl_aVvz35-60", label: "rdfs:label", target: "lit_12" }
]
};
export default graphData;