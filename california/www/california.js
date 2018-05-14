// California (c) Baltasar 2018 MIT License <baltasarq@gmail.com>


ctrl.setTitle( "California" );
ctrl.setIntro(
    "<p><i>Por una desierta, oscura autopista, \
    <br/>noto el aire fresco entre mi pelo, \
    <br/>y un caliente olor de colillas sube desde el cenicero. \
    <br/>Un reflejo reluce más allá en la distancia, \
    <br/>Mi cabeza embotada, y mi vista cansada, \
    <br/>me dicen que parar esta noche es una decisión acertada.</i> \
    <br/> \
    <br/><b><i>Hotel California</i></b>, por <b>The eagles</b>.\
    </p>"
);

ctrl.setPic( "res/road.jpg" );
ctrl.setAuthor( "baltasarq@gmail.com" );
ctrl.setVersion( "1.0 20180513" );

// *** Locs ==============================================================
// --------------------------------------------------------------- Road --
var locRoad = ctrl.places.creaLoc(
    "Oscura y desierta carretera",
    [ "carretera" ],
    "Notas el aire en tu pelo mientras escuchas ${la radio del coche, ex radio} \
    conduciendo por una carretera serpenteante. \
    Cansado, ${debes parar por esta noche, n}, y ves en la distancia \
    el ${cartel de un motel, ex cartel}, cimbreante."
);

locRoad.pic = "res/road.jpg";

locRoad.getExitsDesc = function() {
    return "Tu cabeza te pesa y tu mirada se estrecha: debes ${parar, n} por esta noche.";
};


const objRadio = ctrl.creaObj(
    "radio",
    [],
    "La radio del coche, al lado del cenicero, lleno de <i>colitas</i>.",
    locRoad,
    Ent.Scenery
);

objRadio.songShown = false;
objRadio.preExamine = function() {
    var toret = this.desc;
    
    if ( !this.songShown ) {
        toret += "<br/><i>On a dark desert highway, cool wind in my hair. \
                    Warm smell of colitas, rising up through the air. \
                    Up ahead in the distance, I saw a shimmering light. \
                    My head grew heavy and my sight grew dim, \
                    I had to stop for the night.</i>";
        this.songShown = true;
    }
    
    return toret;
};


const objCartelMotel = ctrl.creaObj(
    "cartel",
    [ "anuncio" ],
    "Un motel con un cartel que rezuma elegancia destaca ahora mismo en la distancia.",
    locRoad,
    Ent.Scenery
);

objCartelMotel.postExamine = function() {
    ctrl.places.showPic( "res/motel.jpg" );
}

// --------------------------------------------------------------- Road --



// Achievements ================================================================
ctrl.achievements.add( "flee_note",
                       "Explorador (encontraste la nota de huida)." );
ctrl.achievements.add( "bucket",
                       "Ordenado (recogiste el cubo)." );
ctrl.achievements.add( "perseverant",
                       "Perseverante (encontraste la palanca)." );
ctrl.achievements.add( "curious",
                       "Curiosón (leíste el libro)." );
ctrl.achievements.add( "farmer",
                       "Granjero (encontraste la estaca)." );
ctrl.achievements.add( "engineer",
                       "Ingeniero (arreglaste el puente)." );
ctrl.achievements.add( "sailor",
                       "Navegante (cruzaste el lago)." );
ctrl.achievements.add( "ambassador",
                       "Embajador (hablaste con el guardián)." );

// Player & booting ============================================================
const pc = ctrl.personas.creaPersona(
    "Don",
    [ "jugador", "don", "donald" ],
    "Don Smith, realizando el viaje por la ruta 66.",
    locRoad
);

const objBrujula = ctrl.creaObj(
    "brújula",
    [ "brujula" ],
    "Indica la dirección.",
    pc,
    Ent.Portable
);

objBrujula.preExamine = function() {
    return ctrl.places.getCurrentLoc().getExitsDesc();
};

ctrl.personas.changePlayer( pc );
ctrl.places.ponInicio( locRoad );
