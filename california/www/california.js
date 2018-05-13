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
    "Una oscura y desierta carretera",
    [ "carretera" ],
    "Muy oscura."
);
locRoad.pic = "res/road.jpg";
locRoad.getExitsDesc = function() {
    return "";
}

var locBordeDelBosque = ctrl.places.creaLoc(
    "Borde del bosque",
    [ "borde del bosque" ],
    "Un ${bosque frondoso, ex selva} comienza al ${norte, n} de este lugar. \
    El camino se interna en él en un brusco giro que proviene \
    desde el ${este, este}."
);
locBordeDelBosque.pic = "res/forest_dense.jpg";

var locBosquePocoDenso = ctrl.places.creaLoc(
    "Bosque poco denso",
    [ "bosque poco denso" ],
    "El camino atraviesa un ${bosque poco denso, ex sotobosque}, \
    en la dirección ${este, este} a ${oeste, oeste}."
);
locBosquePocoDenso.pic = "res/forest_open.jpg";

var locCaminoDeLaMina = ctrl.places.creaLoc(
    "Camino de la mina",
    [ "camino de la mina" ],
    "Múltiples ${herramientas y restos de todo tipo, ex herramientas} \
    se encuentran abandonados, esparcidos al borde del camino \
    que de forma bastante llana discurre de ${este, este} a ${oeste, oeste}."
);
locCaminoDeLaMina.pic = "res/path_mine.jpg";

var locCaminoDeLaSierra = ctrl.places.creaLoc(
    "Camino de la sierra",
    [ "camino de la sierra" ],
    "Una senda parte abruptamente hacia ${las montañas, ex sierra} \
    al ${norte, norte}, escalando por entre ${rocas, ex rocas} \
    que parecen querer proteger ciertos pasos del viento. \
    El camino principal sigue la falda de la ${sierra, ex sierra}, \
    de ${este, este} a ${oeste, oeste}."
);
locCaminoDeLaSierra.pic = "res/path_mountains.jpg";

var objSierra = ctrl.creaObj(
    "sierra",
    [ "montanas", "falda" ],
    "La sierra se eleva hacia el ${norte, norte}.",
    locCaminoDeLaSierra,
    Ent.Scenery
);

var objRocas = ctrl.creaObj(
    "rocas",
    [ "rocas" ],
    "Muchas de ellas son altas, de caprichosas formas.",
    locCaminoDeLaSierra,
    Ent.Scenery
);

objRocas.preExamine = function() {
    var toret = objRocas.desc;

    if ( ctrl.places.limbo.has( objPiedraAfilada ) ) {
        objPiedraAfilada.moveTo( this.owner );
        ctrl.places.updateDesc();
        toret += " En el suelo, algunos gajos de las grandes rocas \
                  se disponen de forma escalonada. Una de ellas, está tan \
                  afilada que llama tu atención.";
    }

    return toret;
};

var objPiedraAfilada = ctrl.creaObj(
    "piedra",
    [ "roca" ],
    "Pesada y de gran filo.",
    ctrl.places.limbo,
    Ent.Portable
);

locCaminoDeLaSierra.preGo = function() {
    var toret = "";

    if ( parser.sentence.term1 == "norte" ) {
        if ( npcSuperviviente.owner == locCaminoDeLaSierra ) {
            if ( npcSuperviviente.status <= 3 ) {
                ++npcSuperviviente.status;
                npcSuperviviente.say( "Más allá de \
                        de estas montañas se encuentra una mina en la que \
                        la colonia trabajaba justo antes del ataque de los \
                        nómadas." );
                toret = "Presientes que continuar con la conversación \
                        dará lugar a interesantes descubrimientos.";
            } else {
                toret = "Continuáis caminando, sombríos.";
            }

            goAction.exe( parser.sentence );
        } else {
            toret = "No le ves sentido a continuar un fatigoso viaje, \
                     dejando atrás la zona de la colonia.";
        }
    } else {
        goAction.exe( parser.sentence );
    }

    return toret;
};

var locCaminoDeLosCultivos = ctrl.places.creaLoc(
    "Camino de los cultivos",
    [ "camino de los cultivos" ],
    "Una pista permite el acceso a varios ${campos de cultivo, ex campos}. \
    Desde aquí se puede llegar al bosque al ${oeste, oeste}, \
    en sentido opuesto a una granja al ${este, este}, en lontananza."
);
locCaminoDeLosCultivos.pic = "res/path_farm.jpg";

var locCaminoDelLago = ctrl.places.creaLoc(
    "Camino del lago",
    [ "camino del lago" ],
    "Desde este lugar, puede apreciarse una pequeña ${vereda, ex vereda} \
    que desciende hacia un lago al ${sur, sur}, mientras el camino principal \
    continúa hacia las montañas al ${oeste, oeste}."
);
locCaminoDelLago.pic = "res/path_mountain_lake.jpg";

var locCaminoDelMolino = ctrl.places.creaLoc(
    "Camino del molino",
    [ "camino del molino" ],
    "Una suave pendiente desciende desde el ${este, este} \
    hasta el río al ${oeste, oeste}, \
    donde puedes ver que se asienta un molino."
);
locCaminoDelMolino.pic = "res/path_mill_river.jpg";

var locCaminoDelMuelle = ctrl.places.creaLoc(
    "Camino del muelle",
    [ "camino del muelle" ],
    "El camino asciende suavemente la ladera de una colina al ${norte, norte} \
    cuya ${vegetación, ex vegetacion} se dispone alrededor del sendero, \
    desde el embarcadero al ${sur, sur}. Una ${senda, ex senda} \
    desciende hacia el ${oeste, oeste}, supones que hacia un río, \
    pues el suave murmullo puede oírse desde aquí."
);
locCaminoDelMuelle.pic = "res/path_from_docks.jpg";

ctrl.creaObj(
    "senda",
    [ "sendero" ],
    "Desciende hacia el murmullo de un río, al ${oeste, oeste}.",
    locCaminoDelMuelle,
    Ent.Scenery
);

var locCaminoHaciaElBosque = ctrl.places.creaLoc(
    "Camino hacia el bosque",
    [ "camino hacia el bosque" ],
    "En las lindes de un bosque. El camino se interna en la \
    ${arboleda, ex arboleda} hacia el ${este, este}, \
    desde la plaza principal del ${pueblo, ex pueblo}, \
    en un amplio giro desde el ${sur, sur}."
);
locCaminoHaciaElBosque.pic = "res/path_forest_border.jpg";

var locCirco = ctrl.places.creaLoc(
    "Circo",
    [ "circo" ],
    "El camino ha ascendido aquí hasta una \
    ${depresión rodeada de picos, ex depresion} de distintas alturas. \
    Se puede descender por dos lados, hacia un lago al ${sur, sur}, \
    y por un cañón herboso al ${este, este}."
);
locCirco.pic = "res/depression.jpg";

var locClaroDelBosque = ctrl.places.creaLoc(
    "Claro del bosque",
    [ "claro" ],
    "Un ${hermoso claro, ex apertura} del bosque en el fondo del \
    ${valle, ex valle}, escondido por la densa vegetación. \
    Siguiendo la suave pendiente, puedes salir del claro hacia una \
    zona superior del valle al ${este, este}."
);
locClaroDelBosque.pic = "res/clear_forest.jpg";
locClaroDelBosque.preGo = function() {
    var toret = "";

    if ( npcSuperviviente.status < 3 ) {
        toret = actions.execute( "talk", "colono" );
        toret += "<br/>Ahora sí piensas que podéis abandonar este lugar.";
    } else {
        toret = goAction.exe( parser.sentence );
    }

    return toret;
};

var locColinaBoscosa = ctrl.places.creaLoc(
    "Colina boscosa",
    [ "colina" ],
    "El bosque asciende perezoso por una suave colina, desde su \
    interior al ${oeste, oeste}, hasta la cumbre de la \
    colina misma al ${este, este}."
);
locColinaBoscosa.pic = "res/hill_forest.jpg";

var locColinas = ctrl.places.creaLoc(
    "Colinas",
    [ "lomas" ],
    "Las colinas escalan por sobre la \
    zona residencial de Epicuren al ${sur, sur}, \
    elevándose hasta las faldas de las montañas al ${norte, norte}. \
    Desde aquí tienes una magnífica ${vista de la colonia, ex vista}."
);
locColinas.pic = "res/hills_north.jpg";

ctrl.creaObj(
    "vista",
    [ "panorama" ],
    "La colonia parece una maqueta a tus pies, asentada sobre una \
    planicie pegada a la costa.",
    locColinas,
    Ent.Scenery
);


var locCruceDeCaminos = ctrl.places.creaLoc(
    "Cruce de caminos",
    [ "cruce de caminos" ],
    "${La senda, ex senda} viene desde el interior de un bosque poco denso al \
    ${oeste, oeste} para dividirse aquí en dos: hacia el ${sur, sur}, \
    con un ramal un poco más estrecho, \
    y de cara a la salida del bosque al ${este, este}."
);
locCruceDeCaminos.pic = "res/path_divides.jpg";

var locEntradaDeLaMina = ctrl.places.creaLoc(
    "Entrada de la mina",
    [ "entrada" ],
    "Una ${boca oscura, ex mina} \
    guarda la entrada a una mina excavada en la roca. Un camino parte \
    de la mina hacia el ${oeste, oeste}."
);
locEntradaDeLaMina.pic = "res/mine_entrance.jpg";

var locEpicuren = ctrl.places.creaLoc(
    "Epicuren",
    [ "epicuren" ],
    "La plaza del pueblo de Epicuren. Desde aquí se ve \
    ${la iglesia, ex iglesia}. Un camino sale hacia un \
    ${bosque, ex bosque} al ${norte, norte}, \
    otro continúa hacia la zona residencial al ${oeste, oeste}."
);
locEpicuren.pic = "res/town.jpg";
locEpicuren.postExamine = function() {
    if ( this.getTimesExamined() == 1 ) {
        ctrl.print( "Contemplas la plaza del malogrado pueblo." );
        ctrl.personas.getPlayer().say(
            "Estas gentes tuvieron tiempo de organizarse." );
    }
};

var locEscuela = ctrl.places.creaLoc(
    "Finca de la Escuela",
    [ "finca" ],
    "El edificio sin terminar para una futura ${escuela, ex escuela}. \
    De nuevo compruebas que no hay un deterioro avanzado, \
    aunque la apariencia es de marcado abandono. \
    Podrías ${entrar, s} en ella. \
    Al lado, hay un ${pozo, ex pozo}. \
    El camino que proviene del ${norte, n}, termina a los pies de la entrada."
);
locEscuela.pic = "res/school.jpg";

var objPozo = ctrl.creaObj(
    "pozo",
    [],
    "Un pozo artesano, del que sobresale un metro del cerco de piedra \
     se asienta muy cerca de la ${escuela, ex escuela}, \
     rematado en su parte superior con un soporte.",
    locEscuela,
    Ent.Scenery
);
objPozo.extended = true;

objPozo.preExamine = function() {
    var toret = objPozo.desc;

    if ( this.extended ) {
        toret += " Del soporte cuelga una polea \
                   que podrías ${usar, tira de pozo}. \
                   Una cuerda se pierde en la oscura hoquedad.";
    } else {
        toret += " El cubo está recogido, colgando muy cercano a la polea.";
    }

    return toret;
};

objPozo.prePull = function() {
    var toret = "El cubo ya está recogido.";

    if ( this.extended ) {
        this.extended = false;
        ctrl.print( "Haciendo girar la polea chirriante, \
                 recoges lentamente la cuerda, con alguna dificultad, \
                 pues pasado el primer tramo, la parte mojada se encontraba \
                 hinchada al haber estado sumergida." );
        ctrl.personas.getPlayer().say( "El cubo está podrido y resquebrajado, \
                 es ya inútil para contener el agua en su interior." );
        ctrl.achievements.achieved( "bucket" );
        toret = "Te sientes raro, \
                 como explorando los restos de una civilización ajena. \
                 De nuevo preguntas sin respuesta alguna hostigan tu mente.";
    }

    return toret;
};

var locInteriorEscuela = ctrl.places.creaLoc(
    "Interior de la escuela",
    [],
    "Abandonada y rota, las alimañas han dejado el aula desangelada, \
     con restos por el suelo y la ${pizarra, ex pizarra} resquebrajada. \
     Los ${pupitres, ex pupitres}, como ajenos a la situación, \
     todavía se alzan en sus antiguas posiciones. \
     El ${atril, ex atril} del profesor destaca al fondo. \
     La puerta, colgando de sus goznes, permite la salida al ${norte, n}."
);
locInteriorEscuela.pic = "res/school_interior.jpg";
locInteriorEscuela.setExitBi( "norte", locEscuela );

var objPizarra = ctrl.creaObj(
    "pizarra",
    [],
    "Resquebrajada por varios lugares, no sirve ya de mucho ahora.",
    locInteriorEscuela,
    Ent.Scenery
);

ctrl.creaObj(
    "atril",
    [],
    "Vacío, no contiene nada de interés.",
    locInteriorEscuela,
    Ent.Scenery
);

ctrl.creaObj(
    "pupitres",
    [ "pupitre" ],
    "Sobre el más cercano, puedes ver un ${libro, ex libro}.",
    locInteriorEscuela,
    Ent.Scenery
);

var objLibro = ctrl.creaObj(
    "libro",
    [ "quijote" ],
    "Lees: \"En un lugar de la mancha, de cuyo nombre no quiero acordarme, \
    no ha mucho tiempo que vivía un hidalgo...\".",
    locInteriorEscuela,
    Ent.Scenery
);
objLibro.read = false;

objLibro.preExamine = function() {
    var toret = objLibro.desc;

    if ( !this.read ) {
        ctrl.personas.getPlayer().say( "Es emocionante encontrar \
                                        uno de los más recientes maravillas \
                                        de nuestra literatura en este lugar \
                                        abandonado por la mano de Dios... \
                                        y por sus colonos." );
        ctrl.achievements.achieved( "curious" );
        this.read = true;
        toret += "<p>Con gran respeto, soplas la generosa capa de polvo \
                  que se ha depositado sobre las hojas, \
                  pasando después una mano, acariciando las hojas.</p>";
    } else {
        toret = "Ya habías leído \"Don Quijote\" antes. \
                 Te deleitas, sin embargo, curioseando por entre \
                 las primeras páginas.";
    }

    return toret;
};

var locGranja = ctrl.places.creaLoc(
    "Granja",
    [ "granja" ],
    "Una ${granja, ex granero} en evidente estado de abandono, \
    se sitúa en el centro de varios campos de cultivo, \
    que se extienden hacia el ${oeste, oeste}."
);
locGranja.pic = "res/barn.jpg";
locGranja.postExamine = function() {
    if ( this.getTimesExamined() == 1 ) {
        ctrl.personas.getPlayer().say(
            "De nuevo, esa sensación de abandono... \
            ¿Qué puede haber pasado aquí? \
            Las tierras son fértiles y dadivosas."
        );
    }
};

var locIglesia = ctrl.places.creaLoc(
    "Iglesia",
    [ "iglesia" ],
    "El interior de la iglesia, sombrío y húmedo, te resulta desagradable. \
    Puedes ver un ${altar, ex altar} a medio construir... \
    el resto del edificio está vacío. Solo se puede ${salir, salir}."
);
locIglesia.pic = "res/church.jpg";
locIglesia.preExit = function() {
    ctrl.goto( locEpicuren );
    return "La claridad daña temporalmente tus ojos.";
};
locIglesia.postExamine = function() {
    if ( this.getTimesExamined() == 1 ) {
        ctrl.print( "Te santiguas frente al altar." );
        ctrl.personas.getPlayer().say(
            "Por Dios que solventaré este misterio, encontrando a \
             las buenas gentes de Epicuren." );
    }
};

var locInteriorDelBosque = ctrl.places.creaLoc(
    "Interior del bosque",
    [ "interior del bosque" ],
    "El ${camino, ex pista} se bifurca aquí para permitir avanzar \
    hacia el ${este, este}, o en sentido contrario, \
    bajando hacia un pequeño valle al ${oeste, oeste}. \
    Una ligera depresión encamina al paso del río al ${sur, sur}. \
    El bosque empieza a mostrar mucha ${vegetación, ex arbustos} aquí, \
    hasta el punto de que por momentos es complicado avanzar."
);
locInteriorDelBosque.pic = "res/path_inside_forest.jpg";
locInteriorDelBosque.preGo = function() {
    var toret = "";
    var player = ctrl.personas.getPlayer();

    if ( parser.sentence.term1 == "sur" ) {
        toret = "Has cruzado el puente con mucho cuidado.";

        if ( npcSuperviviente.owner == this ) {
            toret += " Don Diego parece inquieto.";
            player.say(
                "No temáis D. Diego, he explorado la colonia \
                 sin peligros ni impedimentos." );
            npcSuperviviente.say( "Lo siento, no puedo evitarlo. \
                                   ¿Habéis ido allende las montañas?" );
            player.say( "No me pareció oportuno." );
            npcSuperviviente.say( "Allí empezó todo..." );
        }
    }

    goAction.exe( parser.sentence );
    return toret;
};

var locLago = ctrl.places.creaLoc(
    "Promontorio",
    [],
    "El camino se torna menos pedregoso a medida que se aleja de la orilla \
    hacia las ${montañas, ex sierra} al ${norte, norte}, \
    mientras muchas pequeñas piedras lisas se acumulan \
    en la orilla del ${lago, ex lago}. \
    Puedes ver una ${casa, ex casa} en un pequeño promontorio \
    sobre la superficie del agua."
);
locLago.pic = "res/house_lake.jpg";
locLago.objs.push( objSierra );
locLago.doEachTurn = function() {
    if ( this.has( objRemo )
      || ctrl.personas.getPlayer().has( objRemo ) )
    {
        objRemo.moveTo( objBote );
        ctrl.print( "Has colocado el remo en el bote." );
    }

    return;
};

locLago.postExamine = function() {
    if ( this.getTimesExamined() == 1 ) {
        ctrl.personas.getPlayer().say(
            "¡Hola! ¿Qué tenemos aquí? \
             Parece un conjunto interesante..."
        );
    }

    return;
};

ctrl.creaObj(
    "cueva",
    [],
    "En lontananza, se puede ver una cueva con una apertura sobre \
    la superficie del agua, junto a una pequeña playa de guijarros.",
    locLago,
    Ent.Scenery
);

var locHabitacionCasaLago = ctrl.places.creaLoc(
    "habitación",
    [ "habitacion", "estancia", "casa" ],
    "La habitación en la que te encuentras es la mejor. \
     El resto está demasiado sucio \
     como para que te interesa. Apenas sí se puede ver por las ventanas. \
     Puedes ${salir, sal}. \
     Contra una de las paredes hay un ${armario, ex armario}."
);
locHabitacionCasaLago.pic = "res/room.jpg";
locHabitacionCasaLago.preExit = function() {
    return ctrl.goto( locLago );
};

var objArmario = ctrl.creaObj(
    "armario",
    [ "puerta", "puertas", "hoja", "hojas", "cadena", "cierre" ],
    "Un armario se encuentra situado contra \
    la pared contraria a la puerta de la habitación.",
    locHabitacionCasaLago,
    Ent.Scenery
);

objArmario.unlocked = false;
objArmario.preExamine = function() {
    var toret = objArmario.desc;
    var player = ctrl.personas.getPlayer();

    if ( !this.unlocked ) {
        toret += " La apertura de las hojas está completamente bloqueada \
                   por una cadena.";

        if ( player.has( objCantoRodado )
          || player.has( objPiedraAfilada )
        )
        {
            toret += " Se te ocurre que podrías \
                       ${romper la cadena, golpea cadena}, usando \
                       el canto rodado del río.";
        }
        else
        if ( player.has( objPalanca ) ) {
            toret += " Se te ocurre que podrías intentar \
                       ${forzar la cadena, golpea cadena}, usando \
                       la palanca.";
        }
    } else {
        toret += " Las hojas están semiabiertas, \
                   permitiendo ver el interior, ";
        if ( objArmario.owner.has( objRemo ) ) {
            toret += "donde hay ${un remo, coge remo}.";
        } else {
            toret += "que está vacío.";
        }
    }

    return toret;
};

objArmario.preAttack = function() {
    var player = ctrl.personas.getPlayer();
    var toret = "Golpeas la cadena";

    if ( player.has( objCantoRodado )
      || player.has( objPiedraAfilada ) )
    {
        objRemo.moveTo( this.owner );
        objArmario.unlocked = true;
        toret += " con la piedra, rompiéndola al tercer intento. \
                  las ${hojas del armario, ex armario} se abren, libres...";
    }
    else
    if ( player.has( objPalanca ) ) {
        toret = "Aunque la cadena es demasiado corta como para poder abrir \
                  las puertas del armario, también es demasiado larga como \
                  para poder hacer fuerza con la palanca.";
    } else {
        toret += "... sin efecto alguno.";
    }

    return toret;
};

var objRemo = ctrl.creaObj(
    "remo",
    [ "pala" ],
    "Una pala en buenas condiciones.",
    ctrl.places.limbo,
    Ent.Portable
);

var locOrillaLago = ctrl.places.creaLoc(
    "Orilla opuesta",
    [],
    "Los guijarros de la reducida playa crujen bajo tus pies. \
     La entrada a la cueva está al pie mismo del arenal, \
     ligeramente ladeada con respecto a la misma. \
     Se puede ${entrar, este} sin complicaciones. \
     Has varado ${el bote, ex bote} en la orilla."
);
locOrillaLago.pic = "res/lake_shore.jpg";

var locCueva = ctrl.places.creaLoc(
    "Cueva",
    [ "astillero" ],
    "Dentro de la cueva encuentras varios ${restos, ex restos} \
     que te hacen pensar en que se le dio un uso de astillero a la misma. \
     Seguramente es donde se construyó el bote en el que llegaste. \
     Solo se puede ${salir, oeste}, al exterior."
);
locCueva.pic = "res/cave.jpg";
locCueva.setExitBi( "oeste", locOrillaLago );

var objRestos = ctrl.creaObj(
    "restos",
    [ "herramientas" ],
    "Distintas herramientas, relacionadas con la construcción de botes.",
    locCueva,
    Ent.Scenery
);

objRestos.preExamine = function() {
    var toret = this.desc;

    if ( ctrl.places.limbo.has( objCuerda ) ) {
        objCuerda.moveTo( this.owner );
        ctrl.places.updateDesc();
        toret += " De entre todas ellas, \
                  localizas ${una cuerda, coge cuerda}.";
    }

    return toret;
};

var objCuerda = ctrl.creaObj(
    "cuerda",
    [ "cordaje" ],
    "Una fuerte cuerda.",
    ctrl.places.limbo,
    Ent.Portable
);

var locLlanura = ctrl.places.creaLoc(
    "Llanura",
    [ "llanura" ],
    "Una sorprendente llanura se extiende aparentemente en todas direcciones, \
    excepto allende el horizonte, donde se aprecian \
    las ${montañas al noreste, ex montanas} por un lado, \
    y ${densos bosques, ex bosques} por el otro. \
    Las ${colinas, ex lomas} se sitúan al ${sur, sur} \
    en un claro declive del terreno, a pesar de todo. \
    Dos sendas parten en sentidos contrarios de la dirección ${este, este} \
    a ${oeste, oeste}."
);
locLlanura.pic = "res/plain.jpg";

var locMolino = ctrl.places.creaLoc(
    "Represa del Molino",
    [ "represa" ],
    "Un ${gran molino, ex molino} se yergue sobre ${el río, ex rapidos}. \
    Aunque abandonado, se percibe aún la fuerza que gestionaba diariamente \
    cuando estaba en uso. Tiene adosado un pequeño almacén, hacia el \
    ${norte, n}. Un abrupto camino asciende hacia el ${este, e}."
);
locMolino.pic = "res/mill.jpg";

var locAlmacen = ctrl.places.creaLoc(
    "almacén",
    [ "almacen" ],
    "Húmedo y frío, este lugar no ha tenido el mantenimiento que debiera. \
     Hay aquí ${saquetas de grano, ex saquetas}, \
     puestas sin aparente orden ni concierto. \
     Puedes salir hacia el ${sur, sur}."
);
locAlmacen.setExitBi( "sur", locMolino );
locAlmacen.pic = "res/store.jpg";

var objSaquetas = ctrl.creaObj(
    "saquetas de grano",
    [ "saqueta", "grano", "saquetas", "sacos", "saco" ],
    "Saquetas de grano, la mayoría de ellas con la tela podrida, y el grano \
     desparramado por el suelo, seguramente como alimento para ratas y otras \
     alimañas. Parecen haber sido guardadas a toda prisa, sin pensar en que \
     el grano dure pasados los inviernos.",
    locAlmacen,
    Ent.Scenery
);
objSaquetas.vecesApartadas = 0;
objSaquetas.preExamine = function() {
    var toret = this.desc;

    if ( objCajas.owner == ctrl.places.limbo ) {
        toret += " Al fondo, tras las saquetas, parece haber algo más... \
                   podrías ${apartarlas, empuja saquetas} para ver lo que es.";
    }

    return toret;
};

objSaquetas.prePush = function() {
    var toret = "Vas apartando saquetas, pero hay mucho trabajo \
                 por delante, todavía.";

    ++this.vecesApartadas;
    if ( this.vecesApartadas > 2 ) {
        objCajas.moveTo( this.owner );
        toret = "Solo un cuarto del almacén está lleno de ${cajas, ex cajas}.";
        locAlmacen.desc += "<br/>Has ido apartando las saquetas hasta dejar \
                           al descubierto unas ${cajas, ex cajas}.";
        ctrl.personas.getPlayer().say(
                        "Estoy como avanzando por capas. En la primera, la más \
                         reciente, almacenaban el grano descuidadamente, en \
                         saquetas, \
                         aún sabiendo que no aguantaría mucho tiempo. \
                         Estas cajas, en cambio, \
                         correspondientes a la etapa más antigua, \
                         sí están preparadas para \
                         resistir durante largas temporadas \
                         las inclemencias del tiempo." );
        ctrl.places.updateDesc();
    }

    return toret;
};

var objCajas = ctrl.creaObj(
    "cajas de grano",
    [ "cajas", "grano", "caja" ],
    "Sólidas cajas que, presumes, estarán llenas de grano. Estas sí parecen \
     haber sido almacenadas correctamente para las épocas duras.",
    ctrl.places.limbo,
    Ent.Scenery
);
objCajas.primeraVezExaminado = true;
objCajas.preExamine = function() {
    var toret = this.desc;

    if ( this.primeraVezExaminado ) {
        this.primeraVezExaminado = false;
        objPalanca.moveTo( this.owner );
        ctrl.places.updateDesc();
        toret += " De entre las cajas, aparece una \
                  ${palanca, coge palanca}.";
        ctrl.achievements.achieved( "perseverant" );
    }

    return toret;
};

var locMuelle = ctrl.places.creaLoc(
    "Muelle",
    [ "muelle" ],
    "Las olas lamen las gruesas ${piedras, ex piedras} de la orilla, \
     suaves cantos rodados pulidos por los continuos embates de la mar. \
     El ${dañado muelle, ex atracadero} apenas se mantiene ya sobre el agua, \
     acusando un grave descuido. \
     Un camino discurre ascendente desde el muelle hacia el ${norte, norte}. \
     Observas cómo tus huellas se graban sobre el polvo, \
     siendo las únicas en el suelo."
);
locMuelle.pic = "res/dock.jpg";

var locPasaje = ctrl.places.creaLoc(
    "Pasaje",
    [ "pasaje" ],
    "El túnel continúa desde ${la salida, oeste} hacia el interior, \
    pero lo más destacable es un ${agujero en el suelo, ex agujero} \
    ligeramente apartado hacia un lateral, como si se hubiera desprendido \
    el suelo al crear el túnel."
);
locPasaje.pic = "res/tunnel.jpg";

locPasaje.preGo = function() {
    var toret = "";

    if ( parser.sentence.term1 == "abajo" ) {
        if ( ctrl.isPresent( objCuerda ) ) {
            ctrl.goto( locSantuario );
            toret = "Atando la cuerda, habéis podido bajar al hueco inferior. \
                     ${Don Diego, habla con Diego} \
                     mira a su alrededor, maravillado.";
        } else {
            toret = "No ves forma de descender. De hecho, parece que solo \
                     podríais descolgaros hasta abajo.";
        }
    } else {
        goAction.exe( parser.sentence );
    }

    return toret;
};

var locPuente = ctrl.places.creaLoc(
    "Paso sobre el río",
    [],
    "${Un puente, ex puente} sobre ${el río, ex rio}, \
    casi comido por la ${vegetación, ex zarzas}, \
    permite continuar avanzando hacia el ${norte, norte}, \
    mientras un ${sendero, ex sendero} parte al pie del puente \
    y se dirige hacia los límites del bosque al ${sur, sur}."
);
locPuente.pic = "res/bridge.jpg";
locPuente.postExamine = function() {
    if ( this.getTimesExamined() == 1 ) {
        ctrl.personas.getPlayer().say(
            "¿Un puente tan alejado de la colonia? ¿Por qué?"
        );
    }
};

locPuente.preGo = function() {
    var toret = "Imposible.";

    if ( parser.sentence.term1 == "norte" ) {
        toret = "Es demasiado inseguro, no es posible.";
        if ( objAnclajes.secured ) {
            ctrl.goto( locInteriorDelBosque );
            toret = "Has cruzado el puente muy cuidadosamente.";
        }
    } else {
        toret = goAction.exe( parser.sentence );
    }

    return toret;
};

var locResidencialDeEpicuren = ctrl.places.creaLoc(
    "Residencial de Epicuren",
    [ "residencial de epicuren" ],
    "La colonia de Epicuren solo es un ${asentamiento, ex asentamiento} \
    incipiente, desde aquí, la zona residencial del pueblo, puedes ver \
    ${algunas casas, ex casas}, y la iglesia yendo hacia el ${este, este}. \
    Bajando hacia el embarcadero al ${sur, sur}, \
    se alcanza la base de esta planicie, \
    que por otra parte rompen las ${colinas, ex colinas}, \
    subiendo hacia el ${norte, n}."
);
locResidencialDeEpicuren.pic = "res/residential.jpg";
locResidencialDeEpicuren.postExamine = function() {
    if ( this.getTimesExamined() == 1 ) {
        ctrl.personas.getPlayer().say(
                            "Es desolador, inmensamente vacío... \
                             Aquí no hay nadie." );
    }
};

var locSantuario = ctrl.places.creaLoc(
    "Santuario",
    [ "santuario" ],
    "De sección circular, esta cueva agrandada y profundizada en la roca \
    está repleta de ${inscripciones, ex inscripciones}, \
    que hacen suponer su función de lugar de culto. \
    Un pequeño ${túnel, ex tunel} sale hacia el ${este, este}."
);
locSantuario.pic = "res/santuary.jpg";

var locTunelSantuario = ctrl.places.creaLoc(
    "Túnel",
    [ "tunel", "pasaje", "pasadizo" ],
    "Este bajo pasadizo en semipenumbra comunica el santuario, \
     al ${oeste, oeste}, con una sala más pequeña al ${este, este}."
);
locTunelSantuario.setExitBi( "oeste", locSantuario );
locTunelSantuario.pic = "res/tunnel_sanctuary.jpg";

var locSacristiaSantuario = ctrl.places.creaLoc(
    "Sala del guardián",
    [ "sacristia", "sala", "salon" ],
    "Una sala abovedada, también iluminada por alguna abertura en lo alto \
     alberga un reducido mobiliario, formado por una mesa, una silla \
     y poco más. Un túnel bajo parte hacia el ${oeste, oeste}."
);
locSacristiaSantuario.setExitBi( "oeste", locTunelSantuario );
locSacristiaSantuario.pic = "res/curator_room.jpg";

var objTunel = ctrl.creaObj(
    "Túnel",
    [ "tunel", "pasaje", "pasadizo" ],
    "El túnel está directamente excavado en la roca, y es ligeramente \
     más bajo que tú, por lo que es necesario caminar agachado por él.",
    locSantuario,
    Ent.Scenery
);
locSacristiaSantuario.objs.push( objTunel );

var locValleEnCortado = ctrl.places.creaLoc(
    "Valle en cortado",
    [ "valle en cortado" ],
    "Un cañón recubierto de distinta vida vegetal se abre \
     desde el ${oeste, oeste} hacia el ${este, este}."
);
locValleEnCortado.pic = "res/canyon.jpg";

var locValleFrondoso = ctrl.places.creaLoc(
    "Valle frondoso",
    [ "valle frondoso" ],
    "Una vegetación casi selvática forma el fondo de este valle. \
    La espesura no te permite apreciar ningún otro camino \
    aparte del que sube hacia un collado sobre el valle al ${este, e}."
);
locValleFrondoso.pic = "res/forest_selvatic.jpg";


// NPC ===================================================================


// Misc ==================================================================
function amusing() {
    return "Este relato fue creado para la <i>JAMCanciones</i> en 2017.<br/> \
            El objetivo era crear ficción interactiva basada en relatos de \
            frontera, inspirándose en ciertas canciones, como por ejemplo, \
            la que elegí para esta ocasión: <i>Nómadas</i>, \
            de Franco Battiato.";
}

var htmlRestartEnding = "<p align='right'>\
                         <a href='javascript: location.reload();'>\
                         <i>Comenzar de nuevo</i></a>.<br/>\
                         <i><a href='#' onClick=\"javascript: \
                         document.getElementById('pAmenity').\
                         style.display='block'; return false\">\
                         Ver curiosidades</a>.</i></p>\
                         <p id='pAmenity' align='right' style='display: none'>"
                         + amusing();

var ending = ctrl.creaObj(
    "ending",
    [],
    "",
    locSacristiaSantuario,
    Ent.Scenery
);

ending.preExamine = function() {
    var dvCmds = ctrl.getHtmlPart( "dvCmds" );
    dvCmds.style.display = "none";
    ctrl.endGame( "<p>El guardián os indica cómo salir de la cueva.<br/>\
                    Camináis apesadumbrados por un pedregoso sendero, \
                    camino del muelle al que arribasteis.<br/>\
                    ─D. Juan, parece que no hay posibilidades.<br/> \
                    ─Así es, D. Diego, mi misión ha fracasado. \
                    Debéis abandonar este lugar, \
                    pues será menester atacar con un gran ejército.<br/>\
                    ─Partiré con vos, si me lo permitís.<br/>\
                    ─Por supuesto."
        + htmlRestartEnding
        + "</p><p>Logros:<br/>"
        + ctrl.achievements.completedAsText() + "</p>",
        "res/dock.jpg" );
    return "";
};


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
