// California (c) Baltasar 2018/19 MIT License <baltasarq@gmail.com>


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
const locRoad = ctrl.places.creaLoc(
    "Oscura y desierta carretera",
    [ "carretera" ],
    "Notas el aire en tu pelo mientras escuchas \
    ${la radio del coche, ex radio} \
    conduciendo por una carretera serpenteante. \
    Cansado, ${debes parar por esta noche, n}, y ves en la distancia \
    el ${cartel de un motel, ex cartel}, cimbreante."
);

locRoad.pic = "res/road.jpg";

locRoad.getExitsDesc = function() {
    return "Tu cabeza te pesa y tu mirada se estrecha: \
            debes ${parar, n} por esta noche.";
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
    let toret = this.desc;

    if ( !this.songShown ) {
        toret += "<br/><i>\"On a dark desert highway, cool wind in my hair.\
                    <br/>Warm smell of colitas, rising up through the air.\
                    <br/>Up ahead in the distance, I saw a shimmering light. \
                    <br/>My head grew heavy and my sight grew dim, \
                    <br/>I had to stop for the night.\"</i>";
        this.songShown = true;
    }

    return toret;
};


const objCartelMotel = ctrl.creaObj(
    "cartel",
    [ "anuncio" ],
    "Un motel con un cartel que rezuma elegancia \
     destaca ahora mismo en la distancia.",
    locRoad,
    Ent.Scenery
);

objCartelMotel.postExamine = function() {
    ctrl.places.showPic( "res/motel.jpg" );
};

// --------------------------------------------- Reception Parking ------------
const locPLReception = ctrl.places.creaLoc(
    "Aparcamiento de recepción",
    [ "aparcamiento", "parking" ],
    "Delante la ${recepción, n}, detrás tu ${coche, entra en coche}, \
     a la izquierda, el ${aparcamiento, o} de refilón."
);
locPLReception.pic = "res/entrance.jpg";
locPLReception.setExitBi( "sur", locRoad );

locPLReception.getExitsDesc = function() {
    return "Tras de ti, la ${carretera, s}, \
            delante ${la recepción, n}, a la izquierda ${más aparcamiento, o}.";
};

const objReceptionDoor = ctrl.creaObj(
    "puerta 11",
    [ "puerta" ],
    "puerta 11",
    locPLReception,
    Ent.Scenery
);

const objFakeCar = ctrl.creaObj(
    "coche",
    [ "auto" ],
    "Tu coche amado, un Camaro muy cuidado.",
    locPLReception,
    Ent.Scenery
);
objFakeCar.preEnter = function() {
    return ctrl.goto( locCar );
};

// --------------------------------------------------------------- Car --------
const locCar = ctrl.places.creaLoc(
    "Coche",
    [ "auto" ],
    "Sentado en tu coche, puedes volver a la ${ruta del asfalto, s}, \
    o quizás ${salir, salir}, aparte de mantenerte sentado."
);
locCar.pic = "res/camaro.jpg";
locCar.setExitBi( "sur", locRoad );

locCar.getExitsDesc = function() {
    return "Podrías volver a la ${ruta asfaltada, s}, pero tu mente \
           se encuentra realmente cansada, \
           mejor hacer la ${parada deseada, salir}.";
};

locCar.preExit = function() {
    return ctrl.goto( locPLReception );
};

// --------------------------------------------------------------- PL1 --------
const locPL1 = ctrl.places.creaLoc(
    "Aparcamiento 1",
     [ "aparcamiento", "parking" ],
     "El aparcamiento se extiende en ambas direcciones, \
      desde la ${recepción, e} al extremo en ${septentrión, o}. \
      Enfrente puedes ver ${la puerta 11, ex puerta}, \
      en el asfalto ves pintado PL1."
);
locPL1.pic = "res/parking_lot2.jpg";
locPL1.setExitBi( "este", locPLReception );

locPL1.getExitsDesc = function() {
    return "A tu izquierda mucho ${aparcamiento, o}, \
            a la ${recepción, e} podrías ir, guardando mucho aliento.";
};

const objPuertaHab11 = ctrl.creaObj(
    "puerta 11",
    [ "puerta" ],
    "puerta 11",
    locPL1,
    Ent.Scenery
);

// --------------------------------------------------------------- PL2 --------
const locPL2 = ctrl.places.creaLoc(
    "Aparcamiento 2",
    [ "aparcamiento", "parking" ],
    "Más aparcamiento, a ${izquierda, o} y ${derecha, e} hasta la extenuación. \
     Además, está la puerta a una habitación ${la puerta 12, ex puerta}, \
     en el asfalto ves pintado PL2."
);
locPL2.pic = "res/parking_lot.jpg";
locPL2.setExitBi( "este", locPL1 );
locPL2.getExitsDesc = function() {
    return "A tu derecha, un ${aparcamiento, e}, \
            a tu izquierda ${otro, o}, cierto.";
};

const objPuertaHab12 = ctrl.creaObj(
    "puerta 12",
    [ "puerta" ],
    "puerta 12",
    locPL2,
    Ent.Scenery
);

// --------------------------------------------------------------- PL3 --------
const locPL3 = ctrl.places.creaLoc(
    "Aparcamiento 3",
    [ "aparcamiento", "parking" ],
    "Más aparcamiento a ${izquierda, o} y ${derecha, e}, \
     desde la recepción al extremo en septentrión. \
     Enfrente puedes ver ${la puerta 13, ex puerta}. El asfalto indica PL3."
);
locPL3.pic = "res/parking_lot.jpg";
locPL3.setExitBi( "este", locPL2 );
locPL3.getExitsDesc = function() {
    return "A tu derecha, un ${aparcamiento, e}, \
            a tu izquierda ${otro, o}, cierto.";
};

const objPuertaHab13 = ctrl.creaObj(
    "puerta 13",
    [ "puerta" ],
    "puerta 13",
    locPL3,
    Ent.Scenery
);

// --------------------------------------------------------------- PL4 --------
const locPL4 = ctrl.places.creaLoc(
    "Aparcamiento 4",
    [ "aparcamiento", "parking" ],
    "El motel casi termina ${en esquina, o} este punto, \
     para volver a la ${recepción, e} necesitarías correr al punto. \
     Enfrente puedes ver ${la puerta 14, ex puerta}. En el asfalto PL4 pintado."
);
locPL4.pic = "res/parking_lot2.jpg";
locPL4.setExitBi( "este", locPL3 );
locPL4.getExitsDesc = function() {
    return "A tu derecha, un ${aparcamiento, e}, \
            a tu izquierda ${otro, o}, cierto.";
};

const objPuertaHab14 = ctrl.creaObj(
    "puerta 14",
    [ "puerta" ],
    "puerta 14",
    locPL4,
    Ent.Scenery
);


// ------------------------------------------------------ South corner --------
const locSouthCorner = ctrl.places.creaLoc(
    "Esquina",
    [ "aparcamiento", "parking" ],
    "Termina aquí la fachada del edificio, junto a una \
     ${máquina de hielo, ex maquina}."
);
locSouthCorner.pic = "res/parking_lot_corner.jpg";
locSouthCorner.setExitBi( "este", locPL4 );
locSouthCorner.getExitsDesc = function() {
    return "A tu derecha, un ${aparcamiento, e}, \
            hacia delante, por la ${esquina, n}, al motel das un rodeo.";
};

const objIceMachine = ctrl.creaObj(
    "máquina de hielo",
    [ "maquina", "hielo" ],
    "La máquina de hielo tiene algo de hielo en su interior. Poco a poco \
     se irá formando más.",
    locSouthCorner,
    Ent.Scenery
);

// ------------------------------------------------------ Alley ---------------
const locAlley = ctrl.places.creaLoc(
    "Callejón",
    [ "callejon" ],
    "El callejón termina en un muro donde se alinean \
    ${cubos de basura, ex cubos}."
);
locAlley.pic = "res/dumps_in_alley.jpg";
locAlley.setExitBi( "sur", locSouthCorner );
locAlley.getExitsDesc = function() {
    return "Hacia atrás puedes volver a la ${esquina, s}, \
            y esa me, me temo, es la única salida.";
};

const objCubosBasura = ctrl.creaObj(
    "cubos de basura",
    [ "cubo", "cubos", "basura" ],
    "Cerrados y aún así apestosos, no resultan nada apetitosos.",
    locAlley,
    Ent.Scenery
);

// ------------------------------------------------------ Reception -----------
const locReception = ctrl.places.creaLoc(
    "Recepción",
    [ "recepcion" ],
    "La ${mujer, ex mujer} que lleva el hotel, alerta, \
     espera desde el dintel de la puerta. \
     Un ${aparato de radio, ex radio} reproducía una agradable melodía."
);

locReception.pic = "res/reception.jpg";
locReception.setExitBi( "sur", locPLReception );
locReception.getExitsDesc = function() {
    return "La recepción es tu casa, aunque puedes ${salir ahora, s}.";
};

const objRadioRecepcion = ctrl.creaObj(
    "radio",
    [ "aparato" ],
    "",
    locReception,
    Ent.Scenery
);

objRadioRecepcion.listened = false;
objRadioRecepcion.preExamine = function() {
    let toret = this.desc;

    if ( !this.listened ) {
        toret += "<br/>\"<i>There she stood in the doorway;\
                   <br/>I heard the mission bell.\
                   <br/>And I was thinking to myself:\
                   <br/>'This could be heaven or this could be Hell.'\"</i>";
        this.listened = true;
    } else {
        toret += "Reproducía <i>pop</i> como compañía";
    }

    return toret;
};

const pnjWoman = ctrl.personas.creaPersona(
    "mujer",
    [ "recepcionista" ],
    "Su belleza hostiga tu mente, es ciertamente una mujer hermosa.\
     Confuso por su presencia, apenas puedes pensar en otra cosa.",
    locReception
);

// ------------------------------------------------------ Hall ---------------
const locHall = ctrl.places.creaLoc(
    "Hall",
    [ "hall" ],
    "El recibidor abre paso hacia \
	 distintas dependencias: ${la recepción, s}, \
	 ${el comedor, e}, y ${el pasillo, o}."
);

locHall.setExitBi( "sur", locReception );
locHall.getExitsDesc = function() {
    return "La recepción es tu casa, aunque puedes ${salir ahora, s}.";
};

const objRadioHall = ctrl.creaObj(
    "radio",
    [ "aparato" ],
    "",
    locHall
);

// Achievements ================================================================
ctrl.achievements.add( "acusica",
                       "Chivato (avisaste a la policía)." );


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
