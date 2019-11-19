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
        toret += "<br/><i>\"On a dark desert highway, \
                    cool wind in my hair.\
                    <br/>Warm smell of colitas, \
                    rising up through the air.\
                    <br/>Up ahead in the distance, \
                    I saw a shimmering light. \
                    <br/>My head grew heavy and my sight grew dim, \
                    <br/>I had to stop for the night.\"</i>";
        this.songShown = true;
    }

    return toret;
};


const objMotelSign = ctrl.creaObj(
    "cartel",
    [ "anuncio" ],
    "Un motel con un cartel que rezuma elegancia \
     destaca ahora mismo en la distancia.",
    locRoad,
    Ent.Scenery
);

objMotelSign.postExamine = function() {
    ctrl.places.showPic( "res/motel.jpg" );
};

// --------------------------------------------- Reception Parking ------------
const locPLReception = ctrl.places.creaLoc(
    "Aparcamiento de recepción",
    [ "aparcamiento", "parking" ],
    "Delante la ${recepción, n}, detrás tu ${coche, entra en coche}; \
     a la izquierda, el ${aparcamiento, o} de refilón."
);
locPLReception.pic = "res/entrance.jpg";
locPLReception.setExitBi( "sur", locRoad );

locPLReception.getExitsDesc = function() {
    return "Tras de ti, la ${carretera, s}, \
            delante ${la recepción, n}, \
            a la izquierda ${más aparcamiento, o}.";
};

const objReceptionDoor = ctrl.creaObj(
    "puerta 11",
    [ "puerta" ],
    "Ningún detalle de mención llama tu atención.",
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
    "Sentado en tu coche, puedes volver a la ${ruta del asfalto, s}; \
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

const objDoorRoom11 = ctrl.creaObj(
    "puerta 11",
    [ "puerta" ],
    "Ningún detalle de mención llama tu atención.",
    locPL1,
    Ent.Scenery
);

// --------------------------------------------------------------- PL2 --------
const locPL2 = ctrl.places.creaLoc(
    "Aparcamiento 2",
    [ "aparcamiento", "parking" ],
    "Más aparcamiento, \
     a ${izquierda, o} y ${derecha, e} hasta la extenuación. \
     Además, está la puerta a \
     la ${puerta 12, ex puerta}, \
     en el asfalto ves pintado PL2."
);
locPL2.pic = "res/parking_lot.jpg";
locPL2.setExitBi( "este", locPL1 );
locPL2.getExitsDesc = function() {
    return "A tu derecha, un ${aparcamiento, e}, \
            a tu izquierda ${otro, o}, cierto.";
};

const objDoorRoom12 = ctrl.creaObj(
    "puerta 12",
    [ "puerta", "12" ],
    "Puerta 12: ningún detalle de mención llama tu atención. \
     Excepto el ${felpudo, ex felpudo} a su lado, peludo aliado.",
    locPL2,
    Ent.Scenery
);

const objDoormat = ctrl.creaObj(
    "felpudo",
    [ "moqueta" ],
    "El felpudo, con un grabado como de nogal, no tiene nada especial.",
    locPL2,
    Ent.Scenery
);
objDoormat.postExamine = function() {
    if ( ctrl.places.limbo.has( objBench ) ) {
        objBench.moveTo( this.owner );
        objDoorRoom12.desc += " Y un ${banco corrido, ex banco}, \
                            que parecía escondido.";
        ctrl.print( "Por el puro sino, al examinar el felpudo observas que \
                 también hay un ${banco, ex banco} corrido." );
    }
    
    return;
};

const objBench = ctrl.creaObj(
    "banco",
    [],
    "Es un banco normal y corriente.",
    ctrl.places.limbo,
    Ent.Scenery
);
objBench.postExamine = function() {    
    if ( ctrl.places.limbo.has( objWallet ) ) {
        objWallet.moveTo( objBench.owner );
        ctrl.print( "Al estar medio agachado, ${una cartera, coge cartera} \
                   bajo al banco has encontrado." );
    }
    
    return toret;
};

const objWallet = ctrl.creaObj(
    "cartera",
    [],
    "Una cartera juvenil, con cierre de velcro.",
    ctrl.places.limbo,
    Ent.Portable,
);

objWallet.preTake = function() {
    const player = ctrl.personas.getPlayer();
    let toret = "No alcanzas la cartera bajo el banco, demasiado alejado.";
    
    if ( player.has( objStick ) ) {
        toret = takeAction.exe( parser.sentence );
        toret = "Con gran esfuerzo, te has agachado \
                 y has tirado de la cartera hacia ti, usando el palo. "
                 + toret;
    }
    
    return toret;
};

objWallet.preExamine = function() {
    const player = ctrl.personas.getPlayer();
    let toret = this.desc;
    
    if ( ctrl.places.limbo.has( objCoin ) ) {
        objCoin.moveTo( player );
        toret += " ¡Has encontrado ${una moneda, ex moneda}!";
    }
    
    return toret;
};

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

const objDoorRoom13 = ctrl.creaObj(
    "puerta 13",
    [ "puerta" ],
    "Ningún detalle de mención llama tu atención.",
    locPL3,
    Ent.Scenery
);

// --------------------------------------------------------------- PL4 --------
const locPL4 = ctrl.places.creaLoc(
    "Aparcamiento 4",
    [ "aparcamiento", "parking" ],
    "El motel casi termina ${en esquina, o} este punto, \
     para volver a la ${recepción, e} necesitarías correr al punto. \
     Enfrente puedes ver ${la puerta 14, ex puerta}. \
     En el asfalto PL4 pintado."
);
locPL4.pic = "res/parking_lot2.jpg";
locPL4.setExitBi( "este", locPL3 );
locPL4.getExitsDesc = function() {
    return "A tu derecha, un ${aparcamiento, e}, \
            a tu izquierda ${otro, o}, cierto.";
};

const objDoorRoom14 = ctrl.creaObj(
    "puerta 14",
    [ "puerta" ],
    "Sientes algo de tumulto en su interior, \
     podrías acercarte para ${oir, registra puerta} algo mejor.",
    locPL4,
    Ent.Scenery
);
objDoorRoom14.free = false;
objDoorRoom14.listened = false;
objDoorRoom14.preSearch = function() {
    let toret = "La conversación prosigue en el interior, \
                 a veces con murmullos, a ratos con gran fragor.";
    
    if ( !this.listened ) {
        toret = "Se trata de una conversación \
                entre un hombre y una mujer...,\
                insistente ella, cansado él.\
                ─ ...<br/>\
                ─ Es que no entiendo qué es \
                lo que quieres que haga yo...<br/>\
                ─ Joder, ¡espabila! \
                No estamos ni a veinte kilómetros de allí.<br/>\
                ─ ¿Crees que nos persiguen?<br/>\
                ─ ¡No lo sé! ¿Lo sabes tú?<br/>\
                El hombre parece niervioso repentinamente.<br/>\
                ─ A ver, hemos sido cuidadosos, \
                llevábamos chándal y máscaras durante \
                el atraco, y las matrículas embarradas, \
                nos hemos deshecho de las armas y de la ropa..., \
                hemos lavado el coche... \
                ¿Como habrían de localizarnos aquí?<br/>\
                ─ Pues mira, no lo sé, \
                pero alguien puede darse cuenta de algo... \
                ¡si ve que llevamos una bolsa deportiva \
                llena de dinero en efectivo!.<br/>\
                ─ Seguir corriendo con el coche \
                de madrugada no nos garantiza \
                nada, incluso podría ser sospechoso. \
                Aquí estamos bien.<br/>\
                ─ ¡No me lo puedo creer!<br/>\
                La conversación prosigue presto, \
                pero ya imaginas el resto.";
        
        this.listened = true;
    }

    return toret;
};

// ------------------------------------------------------ South corner --------
const locSouthCorner = ctrl.places.creaLoc(
    "Esquina",
    [ "aparcamiento", "parking" ],
    "Termina aquí la fachada del edificio, junto a una \
     ${máquina de hielo, ex maquina}. \
     Hacia adelante aparece un ${callejón, n} que rezuma desconsuelo, \
     a la derecha el ${aparcamiento, e} se extiende por el suelo."
);
locSouthCorner.pic = "res/parking_lot_corner.jpg";
locSouthCorner.setExitBi( "este", locPL4 );
locSouthCorner.getExitsDesc = function() {
    return "A tu derecha, un ${aparcamiento, e}, \
            hacia delante, por la ${esquina, n} al motel rodeas con tiento.";
};

const objCoin = ctrl.creaObj(
    "moneda",
    [],
    "Una moneda.",
    ctrl.places.limbo,
    Ent.Portable
);

const objIceMachine = ctrl.creaObj(
    "máquina de hielo",
    [ "maquina", "hielo", "ranura" ],
    "La máquina de hielo está a medio llenar. \
     Una ranura monedas permite insertar.",
    locSouthCorner,
    Ent.Scenery
);

objIceMachine.preExamine = function() {
    let toret = this.desc;
    
    if ( this.getTimesExamined() > 2 ) {
        toret += " Por pura frustración, la máquina \
                   podrías ${golpear, golpea maquina}."
    }
    
    return toret;
};

objIceMachine.preAttack = function() {
    let toret = "La máquina has golpeado, aunque con poco efecto logrado.";
    
    if ( ctrl.places.limbo.has( objCoin ) ) {
        objCoin.moveTo( locSouthCorner );
        toret = "Una olvidada ${moneda, coge moneda} \
                 de la máquina has logrado, \
                 por algún motivo allí se había quedado. ";
        
        ctrl.achievements.achieved( "frustrado" );
    }
    
    return toret;
};

// ------------------------------------------------------ Alley ---------------
const locAlley = ctrl.places.creaLoc(
    "Callejón",
    [ "callejon" ],
    "Desde el ${comienzo del callejón, s} a un muro, \
    puedes ver como se alinean varios \
    ${cubos, ex cubos}. Por encima de la basura, \
    un ${teléfono, ex telefono} cuelga a cierta altura."
);
locAlley.pic = "res/dumps_in_alley.jpg";
locAlley.setExitBi( "sur", locSouthCorner );
locAlley.getExitsDesc = function() {
    return "Hacia atrás puedes volver a la ${esquina, s}, \
            y esa me, me temo, es la única salida.";
};

const objDumpBins = ctrl.creaObj(
    "cubos de basura",
    [ "cubo", "cubos", "basura" ],
    "Cerrados y aún así apestosos, no resultan nada apetitosos. \
    Puedes ver un ${cubo alto y delgado, ex alto}, \
    ${otro bajo y achatado, ex achatado}.",
    locAlley,
    Ent.Scenery
);

const examineDumpBins = function(self) {
    let toret = self.desc;
    
    if ( self == objDumpBin2
      && ctrl.places.limbo.has( objStick ) )
    {
        objStick.moveTo( locAlley );
        toret += " Descubres ${un palo, coge palo} tras el contenedor.";
    }
    
    if ( objDumpBin1.getTimesExamined() > 0
      && objDumpBin2.getTimesExamined() > 0 )
    {
        ctrl.achievements.achieved( "gato" );
    }
    
    return toret;
};

const objDumpBin1 = ctrl.creaObj(
    "cubo alto y delgado",
    [ "alto", "delgado" ],
    "Lleno de basura, por la tapa casi rezuma.",
    locAlley,
    Ent.Scenery
);
objDumpBin1.preExamine = function() { return examineDumpBins( this ); };

const objDumpBin2 = ctrl.creaObj(
    "cubo bajo y achatado",
    [ "bajo", "achatado" ],
    "El cubo achatado sin contenido ha quedado.",
    locAlley,
    Ent.Scenery
);
objDumpBin2.preExamine = function() { return examineDumpBins( this ); };

const objStick = ctrl.creaObj(
    "palo",
    [],
    "Es un pequeño palo, nada que te resulte extraño.",
    ctrl.places.limbo,
    Ent.Portable
);

const objPhone = ctrl.creaObj(
    "teléfono",
    [ "telefono", "cabina" ],
    "El teléfono está conectado, exigiendo pago al contado.",
    locAlley,
    Ent.Scenery
);

objPhone.preExamine = function() {
    let toret = this.desc;
    
    if ( objDoorRoom14.listened
      && ctrl.isPresent( objCoin ) )     
    {
        toret += " Podrías ${llamar a la policía, coge telefono}, \
                   una buena acción sería... \
                   y quizás la habitación obtendrías.";
    }
    
    return toret;
};

objPhone.preTake = function() {
    let toret = "Llamas por teléfono a la policía.\
                <br/>─ He localizado a los ladrones de una gasolinera, \
                  están en el motel California.\
                <br/>─ Bien señor, ¿puede darme su nombre?\
                <br/>─ ...\
                Cuelgas el aparato.\
                <br/>Esperas pacientemente \
                hasta que oyes que alguien llega. \
                Efectivamente, es un coche patrulla. \
                Tras entrar en la recepción, la recepcionista \
                les acompaña con la llave hasta la habitación 14.\
                <br/>Con bastante forcejeo, pero sin disparos, \
                los agentes se llevan detenidos a los ocupantes \
                de la habitación. La mujer, que se había mantenido \
                prudentemente al margen, suspira, revisa la habitación \
                y la cierra.";
                

    objDoorRoom14.free = true;
    objCoin.moveTo( this );
    ctrl.achievements.achieved( "acusica" );
    return toret;
};

// ------------------------------------------------------ Reception -----------
const locReception = ctrl.places.creaLoc(
    "Recepción",
    [ "recepcion" ],
    "La ${mujer, ex mujer} que llevaba el hotel, alerta, \
     esperaba desde el dintel de la ${puerta, s}. \
     Un ${aparato de radio, ex radio} reproducía una alegre melodía. \
     Al verte entrar la mujer se sitúa tras la barra del contador, \
     lista para atenderte con aire encantador."
);
locReception.pic = "res/reception.jpg";
locReception.setExitBi( "sur", locPLReception );
locReception.getExitsDesc = function() {
    let toret = "Dejar la ${recepción, s} con su contador";
    
    if ( this.getExit( "norte" ) != null ) {
        toret += ", o ir al ${recibidor, n}";
    }
    
    return toret + ".";
};
locReception.preLook = function() {
    let toret = this.desc;
    
    if ( this.getExit( "norte" ) != null ) {
        toret += " Un ${recibidor, n} se ve tras el mostrador.";
    }
    
    return toret;
};

const objReceptionRadio = ctrl.creaObj(
    "radio",
    [ "aparato" ],
    "",
    locReception,
    Ent.Scenery
);
objReceptionRadio.listened = false;
objReceptionRadio.preExamine = function() {
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

const objRoomKey = ctrl.creaObj(
    "llave",
    [ "llave" ],
    "La llave asignada, \"14\" se destaca en la parte dorada.",
    ctrl.places.limbo,
    Ent.Portable
);

const pnjWoman = ctrl.personas.creaPersona(
    "mujer",
    [ "recepcionista" ],
    "Su belleza hostiga tu mente, es ciertamente una mujer hermosa.\
     Confuso por su presencia, apenas puedes pensar en otra cosa.",
    locReception
);

pnjWoman.status = 0;
pnjWoman.preTalk = function() {
    let toret = "Su aire ausente ofende tu mente.";
    
    if ( objDoorRoom14.free ) {
        this.status = 2;
    }
    
    if ( this.status == 0 ) {
        toret = "─Temo que no tenemos ninguna habitación libre.\
                 <br/>─¿Ninguna habitación? ¡Increíble!\
                 <br/>─Está todo ocupado.\
                 <br/>No hay suerte. \
                 Y no puedes volver a conducir en tu estado.";
        
        ++this.status;
    }
    else
    if ( this.status == 1 ) {
        toret = "─No hay habitaciones, señor.\
                <br/>Te retiras del contador con gran dolor.";
    }
    else
    if ( this.status == 2 ) {
        toret = "─ ¿Hay alguna habitación libre?\
                 <br/>─ Señor, es increíble, ¡una acaba de quedar libre!\
                 <br/>Tú sabes que no es cosa de que sea o no creíble...\
                 <br/>La mujer te da la llave. \
                 ¡De descansar hasta mañana eres libre!";
        locReception.setExitBi( "norte", locHall );
        objRoomKey.moveTo( pc );
        ++this.status;
    }
    else
    if ( this.status == 3 ) {
        toret = "─ Ya tiene habitación, señor. \
                 Es libre de pasar al ${comedor, n}.";
    }
    
    return toret;
};

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

const objHallRadio = ctrl.creaObj(
    "radio",
    [ "aparato" ],
    "",
    locHall
);

// Achievements ================================================================
ctrl.achievements.add( "gato",
                       "Gato callejero (revisaste los cubos de basura)." );
ctrl.achievements.add( "frustrado",
                       "Frustrado (golpeaste la máquina de hielo)." );
ctrl.achievements.add( "acusica",
                       "Acusica (avisaste a la policía)." );

// Player & booting ============================================================
const pc = ctrl.personas.creaPersona(
    "Don",
    [ "jugador", "don", "donald" ],
    "Don Smith, realizando el viaje por la ruta 66.",
    locRoad
);

const objCompass = ctrl.creaObj(
    "brújula",
    [ "brujula" ],
    "Indica la dirección.",
    pc,
    Ent.Portable
);

objCompass.preExamine = function() {
    return ctrl.places.getCurrentLoc().getExitsDesc();
};

ctrl.personas.changePlayer( pc );
ctrl.places.ponInicio( locRoad );
