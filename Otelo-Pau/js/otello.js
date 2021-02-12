//---------------------MENU PRINCIPAL DEL JOC------------------------\\        
function validateStart() { //Per a validar que cada field te algo posat
    var incorrecte = false;
    var blank = "";

    if (!document.getElementsByName("jugador1")[0].value) {
        document.getElementById("errorNom").innerHTML = errorPlayer("1");
        incorrecte = true;
    } else {
        document.getElementById("errorNom").innerHTML = blank;
    }

    if (!document.getElementsByName("jugador2")[0].value) {
        document.getElementById("errorNom2").innerHTML = errorPlayer("2");
        incorrecte = true;
    } else {
        document.getElementById("errorNom2").innerHTML = blank;
    }

    if (!(comprovarTamanys() != null)) { //MIra si retorna un tamany o no
        document.getElementById("errorSize").innerHTML = "<p style='color:red;'>Has de seleccionar un tamany de tauler</p>"
        incorrecte = true;
    } else {
        document.getElementById("errorSize").innerHTML = blank;
    }

    return !incorrecte;//Li direm aixi que respongui el contrari ja que busquem si ens diu que algo no va
}


function comprovarTamanys() { //Aqui comprovem si hi ha algun tamany checked, si el te el retornara (aixo ens servira per a loadGame)
    var tamanys = document.getElementsByName('tamany');
    for (var i = 0; i < tamanys.length; i++) {
        if (tamanys[i].checked) {
            return tamanys[i];
        }
    }
    return null;
}

function errorPlayer(usuari) { //Missatge simple de que un jugador no esta posat
    return "<p style='color:red;'>El jugador " + usuari + " esta buit, cal omplir-lo</p>"
}

//------------------------------VARIABLES DEL JOC-----------------------\\
var gameStats = {
    jugadors: [this.nomJugador1, this.nomJugador2],
    puntuacio1: 0,
    puntuacio2: 0,
    numtorn: 0,
    /* colorJugador1: '#ffffff',
    colorJugador2: '##000000', */

    color: function () {
        if (this.numtorn == 0) {
            return "white"
        } else {
            return "black"
        }
    },
    tamany: 0,
    marcades: [],
    nomovesConsec: 0


}

function switchTorn() {
    if (gameStats.numtorn == 0) {
        gameStats.numtorn = 1;
    } else {
        gameStats.numtorn = 0;
    }
}
//-------------------------------COMENÇAR JOC---------------\\
function loadGame() { //Aquesta funcio inicialitza tot el joc de per si, el board i la scoreBoard
    if (validateStart()) { //Solament si el començar del joc esta validat, començarem a assignar valors i crear el tauler
        gameStats.jugadors[0] = document.getElementsByName("jugador1")[0].value;
        gameStats.jugadors[1] = document.getElementsByName("jugador2")[0].value;

        gameStats.tamany = comprovarTamanys().value;
        loadBoard();
        bckColor(gameStats.tamany);
        loadScoreBoard();
    }
}

function bckColor(modo){
    var body = document.getElementsByTagName('body')[0];
    

    if(modo == "8"){
        body.setAttribute("class","pinkred");
    }else if(modo == "10"){
        body.setAttribute("class","blue");
    }else if(modo == "16"){
        body.setAttribute("class","pastelred");
    }else{
        body.setAttribute("class","bodybck");
    }
}
//-------------GAMEBOARD---------\\
/*
    Aqui inicialitzem el tauler, amaguem el  menu principal i ja començara a carregar tot.
    Es fara un codi html dinamicament el tamany segons el que li haguem donat
*/
function loadBoard() {
    var tamany = gameStats.tamany;
    document.getElementById("gameStart").setAttribute("class", "hidden");

    var gameBoard = document.getElementById("gameBoard");


    var htmlBoard = "<table class='cien'><tbody>";

    var nomFitxa = "fitxa" + tamany;
    for (var row = 1; row <= tamany; row++) {
        htmlBoard += "<tr>";

        for (var col = 1; col <= tamany; col++) {
            htmlBoard += "<td id='cell_" + row + "_" + col + "' class='" + nomFitxa + " gameboardColumn'></td>";
        }
        htmlBoard += "</tr>";
    }
    htmlBoard += "</tbody></table>";
    gameBoard.innerHTML = htmlBoard;

    gameBoard.setAttribute("class", "flex cien"); //La pantalla estara en blanc fins que carregui tot

    inicialitzarBoard(tamany);
    checkMoves();
}

function inicialitzarBoard(tamany) { //Posa les primeres cuatre fitxes
    var mitjtamany = tamany / 2;
    document.getElementById("cell_" + mitjtamany + "_" + mitjtamany).innerHTML = "<span class='white fitxa'>";
    document.getElementById("cell_" + mitjtamany + "_" + (mitjtamany + 1)).innerHTML = "<span class='black fitxa'>";
    document.getElementById("cell_" + (mitjtamany + 1) + "_" + mitjtamany).innerHTML = "<span class='black fitxa'>";
    document.getElementById("cell_" + (mitjtamany + 1) + "_" + (mitjtamany + 1)).innerHTML = "<span class='white fitxa'>";

}

//--------------SCOREBOARD----------\\
function loadScoreBoard() {
    var scoreBoard = document.getElementById("scoreBoard");

    scoreBoard.setAttribute("class", "flex scoreBoard scoreBoardColumn");

    var nomjugador1 = nameShortner(gameStats.jugadors[0]);
    var nomjugador2 = nameShortner(gameStats.jugadors[1]);

    document.getElementById("nomJugador1").innerHTML = nomjugador1;
    document.getElementById("nomJugador2").innerHTML = nomjugador2;

    refreshInfo();
}

function refreshInfo() { //Ens servira per a que cada vegada que un jugador realitizi un moviment, actualitzar l'HTML
    actualitzarPuntuacio();
    document.getElementById("jugadorActual").innerHTML = gameStats.jugadors[gameStats.numtorn];
    document.title = '⚪ ' + gameStats.puntuacio1 + ' - ' + gameStats.puntuacio2 + ' ⚫ - Otello';
}

function nameShortner(nom) { //Aquesta funcio serveix per a acortar el nom si es massa llarg
    if (nom.length > 10) {
        return nom.substring(0, 9) + ".";
    }
    return nom;
}

//Inicilalitzar un array multidimensional amb el tamany de tauler
//fent que al centre sigui color1-color2 \ln color2-color1  ---FER ALEATORI(???)
//Fer que es posi dins de un canvas
//Aquest canvas s'expandira segons la mesura
//li direm que posi que onClick(funcio(x,y)) a cadascun dels divs o a que hi hagi per a representar cada field  

//n tot moment s'ha de mostrar l'estat i el desenvolupament del joc. Aquesta informació pot aparèixer de la forma que creguis més convenient.
//Fer marcador a la part d'adalt que es vagi actualitzant

//MARCADOR una funcio que cada vegada que fagi punt s'actualitzi innerhtml

function actualitzarPuntuacio() {
    var score = document.getElementById("gameBoard").getElementsByClassName("white");
    gameStats.puntuacio1 = score.length;
    document.getElementById("scorejugador1").innerHTML = gameStats.puntuacio1;

    var score = document.getElementById("gameBoard").getElementsByClassName("black");
    gameStats.puntuacio2 = score.length;
    document.getElementById("scorejugador2").innerHTML = score.length;
}


//-------------------CHECK SI HI HA FITXA DISPONIBLE ------------------------\\

//al realitzarse un moviment comprova de nou quins moviments es poden fer
//Primer agafa quina es el torn actual
//Fa un collection de tots els que tinguin la clase del mateix tipus del que toca aquell torn
//Mira llavors el voltant de cadascun de les fitxes si tenen un color oposat
//Si troba que hi ha un del mateix color segueix aquella direccio (sigui que troba un a la dreta mirará la pos +1) //Es pot navegar per les id que son un array
//Segueix fins que acabi, si acaba en mateix color que origen malament
//Sino sera una cel·La compatible i es marcará afegint la clase compatible i guardará en un array per a desactivarlo al fer clic 
//Es repeteix fins que no quedin voltants
//avança a la seguent fitxa

//D'aqui s'afegueix 


//FER UN LOOP MENTRES ENCARA QUEDIN ESPAIS DISPONIBLES QUE ES SEGUEIXI
function checkMoves() { //Aqui mirem tot el tauler, les fitxes del color actual i d'alli mirem quins moviments te disponibles
    var color = gameStats.color();

    var fitxesTorn = document.getElementById("gameBoard").getElementsByClassName(color);
    var numFitxes = fitxesTorn.length;
    var idFitxaAct;
    for (var i = 0; i < numFitxes; i++) {
        idFitxaAct = fitxesTorn[i].parentElement.id;
        checkEnemy(idFitxaAct);
    }
    if (noMoves()) {
        gameStats.nomovesConsec++; //Comprovant si torna a mirar y no pot fer res a cap dels dos;
        if (gameOver()) {
            loadEndGame();
        } else { //Aqui es salta el torn ja que no pot moure i fa els comprovants corresponents
            switchTorn();
            cleanUpAll();
            refreshInfo(); //Per a que mostri que li torna a tocar a el mateix usuari
            checkMoves();
        }

    } else {
        loadBad();
        gameStats.nomovesConsec = 0;
    }
}


function outOfBound(numDesti, numCol) { //Comprova estar dins del rang
    if (numDesti <= 0 || numDesti > gameStats.tamany || numCol <= 0 || numCol > gameStats.tamany) { //Out of bounds
        return false;
    }
    return true;
}
function loadBad() {
    var column = document.getElementsByClassName("gameboardColumn");
    for (var i = 0; i < column.length; i++) {
        if (!column[i].hasChildNodes() && !column[i].classList.contains("available")) {
            column[i].classList.add("bad");
            column[i].addEventListener("click", badMove, false)
        }
    }

}
function badMove() {
    var idActual = this.id;
    document.getElementById(idActual).innerHTML = "<span class='error fitxa'>"
    setTimeout(function () {
        document.getElementById(idActual).innerHTML = "";
    }, 500);

}
function noMoves() {
    if (document.querySelectorAll(".available").length == 0) {
        return true;
    }
    return false;
}

//Fer que joc es desactivi 
function gameOver() {
    if ((gameStats.puntuacio1 + gameStats.puntuacio2) == Math.pow(gameStats.tamany, 2)) { //Arriba al total de tamany * tamany
        return true;
    }
    if (gameStats.nomovesConsec == 2) { //No queden cap fitxa del color enemic
        return true;
    }
    return false;
}

function loadEndGame() {
    document.getElementById("gameBoard").setAttribute("class", "hidden");
    document.getElementById("scoreBoard").setAttribute("class", "hidden");
    
    document.getElementById("gameEnd").setAttribute("class", "centratInfo lowOpacityBck");
    
    document.getElementById("winner").innerHTML = win();
    document.title = 'Ha guanyat el jugador ' + win() + ' - Otello';
    //Carregar modal de mostrarScoreBoard final i que dirá qui ha guanyat al final
    document.getElementById("restartbutton").addEventListener("click", function () { //Retorna al inici
        bckColor('');
        document.getElementById("gameEnd").setAttribute("class", "hidden");
        document.getElementById("gameStart").setAttribute("class", "centratInfo");
        document.title = '⚪ Otello ⚫'
    })
}

function win(){
    if(gameStats.puntuacio1 > gameStats.puntuacio2) return gameStats.jugadors[0] + " ⚪";
    return gameStats.jugadors[1] + " ⚫";
}
//Li alimentem la id aixi sabrem si hi ha algo aprop
function checkEnemy(idposActual) { //Aquesta funcio mirará si hi ha moviments disponibles
    var colorActual = gameStats.color();
    var movimentsAComprovar = [
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 0],
        [-1, 0]
    ];
    var rowPos = parseInt(idToRowPos(idposActual)); //Agafar num de row Inicial
    var colPos = parseInt(idToColPos(idposActual)); //Agafar num de col Inicial
    var numMovimentsPosibles = movimentsAComprovar.length;

    for (var row = 0; row < numMovimentsPosibles; row++) {
        var rowDesti = (rowPos + movimentsAComprovar[row][0]);
        var colDesti = (colPos + movimentsAComprovar[row][1]);

        if (!outOfBound(rowDesti, colDesti)) {
            continue; //Si arriba aqui, salta aquesta iteracio
        }


        var stringIDOrigen = "cell_" + rowDesti + "_" + colDesti; //Sumem la pos desti Origen i d'alli potser segiurem mirant
        var posAMirarposOrigen = document.getElementById(stringIDOrigen); //Mira cel·la per cel·la

        var potencialMoviment = [stringIDOrigen, []];
        var i = 1;
        if (posAMirarposOrigen.hasChildNodes()) {
            if (!posAMirarposOrigen.firstElementChild.classList.contains(colorActual)) {
                var stringIDDestiSeguit = stringIDOrigen; //Aquests var es aniran actualitzant amb el valor que mirarem en aquell moment, s'anira redefinint
                var posAmirarSeguida = posAMirarposOrigen;
                var bounds = outOfBound((rowPos + (movimentsAComprovar[row][0] * i)), (colPos + (movimentsAComprovar[row][1] * i))); //anirem mirant si esta outOfBounds el que volem mirar seguent
                potencialMoviment[1].push(posAmirarSeguida);
                while (bounds && posAmirarSeguida.hasChildNodes() && !posAmirarSeguida.firstElementChild.classList.contains(colorActual)) { //Mentres sigui del color oposat i mentres tingui fills
                    stringIDDestiSeguit = "cell_" + (rowPos + (movimentsAComprovar[row][0] * i)) + "_" + (colPos + (movimentsAComprovar[row][1] * i));
                    //Linea larga, el que fa es que li donem la posicio de abans i mirar un mes endevant la seva direccio, osigui si es 0,1 mirará 0,2 respectivamrnt l'origen
                    posAmirarSeguida = document.getElementById(stringIDDestiSeguit);
                    bounds = outOfBound((rowPos + (movimentsAComprovar[row][0] * i)), (colPos + (movimentsAComprovar[row][1] * i)));
                    i++
                    potencialMoviment[1].push(posAmirarSeguida);
                }

                if (bounds && !posAmirarSeguida.hasChildNodes()) { //Si no te fills significa que esta buit i ademés que no es del teu mateix color
                    var construit = [posAmirarSeguida.id, potencialMoviment[1]];
                    gameStats.marcades.push(construit);
                    posAmirarSeguida.classList.add("available");
                    posAmirarSeguida.addEventListener("click", flipPoint, false);
                    posAmirarSeguida.removeEventListener("click", badMove, false);
                    posAmirarSeguida.classList.remove("bad");
                    //Afegir event que tingui quina posició estaba dirigint ara pero invers, aixi fent el recorregut fins arribar a la fitxa mateix color
                }

            }
        }
    }
}
/*
    Aqui es on es fa la funcio de girar les fitxes
    (1)Basicament el que fa es recorreix una variable global que tenim que conte quin es el origen de on farem el moviment i el seu ex recorregut que tenim guardat
    (2)Agafa aquell recorregut i gira tots els seus ids, fa aixo agafant la row i col de cadascun dels ids guardats i buscant el elementid corresponent i fentlo del seu color
    (3)Resteixa el marcades ja que el altre color no pot utilitzar el que hem agafat ja i fa totes les preparacions corresponents per a el seguent torn
*/
function flipPoint() {

    //1. Busqueda de moviment i recorregut a seguir
    var o = 0;
    while (o < gameStats.marcades.length) {
        if (gameStats.marcades[o].indexOf(this.id) != -1) {
            var movimentEscollit = gameStats.marcades[o][1];
            //2. Recorreix el cami y gira segons la seva id corresponent al moment
            for (var i = 0; i < movimentEscollit.length; i++) {
                var idActual = movimentEscollit[i].id;
                var rowPos = parseInt(idToRowPos(idActual)); //Agafar num de row Actual
                var colPos = parseInt(idToColPos(idActual)); //Agafar num de col Actual
                document.getElementById("cell_" + ((rowPos)) + "_" + (colPos)).innerHTML = "<span class='" + gameStats.color() + " fitxa'>";
            }
        }
        o++;
    }

    //3. Resets i canvis de torn
    gameStats.marcades = [];

    cleanUpAll();
    switchTorn();
    refreshInfo();
    checkMoves();

}

function idToRowPos(stringPos) { //Conversor de id agafa quin row esta
    var indexOfDash = stringPos.indexOf("_");
    var indexOfDashSecond = stringPos.indexOf("_", indexOfDash + 1);
    return stringPos.substring(indexOfDash + 1, indexOfDashSecond)
}
function idToColPos(stringPos) { //Coversor de id agafa quin col esta
    var indexOfDash = stringPos.indexOf("_");
    var indexOfDashSecond = stringPos.indexOf("_", indexOfDash + 1);
    return stringPos.substring(indexOfDashSecond + 1)
}
function cleanUpAll() { //Treu tots els class available ja que no serveixen ja i els events
    var disponiblesActual = document.querySelectorAll(".available");

    for (var i = 0; i < disponiblesActual.length; i++) {
        disponiblesActual[i].removeEventListener("click", flipPoint, false);
        disponiblesActual[i].classList.remove("available");

    }
    var badActual = document.querySelectorAll(".bad");
    for (var i = 0; i < badActual.length; i++) {
        badActual[i].removeEventListener("click", badMove, false);
        badActual[i].classList.remove("bad");

    }
}