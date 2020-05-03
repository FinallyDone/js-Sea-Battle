//////////////////////////////////// Global elem //////////////////////////////////////

/* Timer для анимации */
var Timer;
/*
    Проверка на изменения в страницы
    для меньшей загрузки на страницу
*/
var ChangesOnPage = false;
// Проверка на победу ПК или Игрока
var GameFinished = true;
// Проверка  для кнопки новой игры
var aimOnButtonNewGame = false;
// Проверка для отрисовки кораблей
var ShipsInGame = false;
// Проверка для отрисовки прицела
var aimOnEnemyField = false;
// положение прицела
var positionAimX;
var positionAimY;
/* "canvas" */
var ctx;
/* Путь к картинкам */
var srcImgs = "material/png/";
/* Массив всех картинок кораблей */
var imgShips = [];
/* Остальные картинки */
// Картинка "прицела" 
var imgAim = new Image();

// Картинка "попадания"
var imgHit = new Image();

// Картинка "промаха"
var imgMiss = new Image();

// Картинка "Заднего фона" игры
var imgBackgroundGame = new Image();
var imgBackgroundGamePosX = 0;
var imgBackgroundGamePosY = 20;
var imgBackgroundGameWidth = 1200;
var imgBackgroundGameHeight = 700;

// Картинка "Новой игры" 
var imgNewGame = new Image();
var imgNewGamePosX = 187;
var imgNewGamePosY = 52;
var imgNewGameWidth = 300;
var imgNewGameHeight = 50;

// Картинка "Новой игры" при нажатие
var imgNewGameChosen = new Image();
var imgNewGameChosenPosX = 177;
var imgNewGameChosenPosY = 25;
var imgNewGameChosenWidth = 420;
var imgNewGameChosenHeight = 83;

// Начальная позиция для кораблей у Игрока
var positionOfFirstCubePersonX = 76;
var positionOfFirstCubePersonY = 167;
// Начальная позиция для кораблей у ПК
var positionOfFirstCubePCX = 600;
var positionOfFirstCubePCY = 167;
// Размеры картинки "1-клеточного корабля"
var imgShipOneWidth = 47;
var imgShipOneHeight = 42;
// размер игрового поля врага
var widthGameFieldPCX = 526;
var widthGameFieldPCY = 470;

/* Элементы игровой механики */
// Массив для рандома поля игры пользователя
var arrayOfEmpyPositionsPerson = new Array(10);
var arrayOfGameFieldPerson = new Array(10);
// Массив для рандома поля игры ПК
var arrayOfEmpyPositionsPC = [];
var arrayOfGameFieldPC = [];
// Массив для рандомного поиска кораблей ПОльзователя
var arrayPositionsForPCBrain = [];
// Путь, куда пойдет ПК
// 1 - вверх, 2 - вниз
// 3 - влево, 4 - вправо
var wherePCgoes = 1;
// Последниий ход, куда ходил ПК
var lastPCmove = [-1, -1];
// Сколько элементов ПК надо уничтожить у корабля 
var howMuchDestroyForPc = 0;

//////////////////////////////////// Functions ////////////////////////////////////////

/* Рендер курсора прицела на вражеском поле */
function renderCursorOnEnemyField() {
    if (arrayOfGameFieldPC[positionAimY][positionAimX] >= 0) {
        ctx.drawImage(imgAim, positionOfFirstCubePCX + positionAimX * 52.9, positionOfFirstCubePCY + positionAimY * 47.4, imgShipOneWidth, imgShipOneHeight);
    }
}

/* Рендер всех кораблей, попадений, промахов на игровом поле */
function renderShipsHitsMisses(arrayOfField, positionOfFirstCubeX, positionOfFirstCubeY) {
    let whichShip;
    for (let i = 0; i < 10; i++)
        for (let j = 0; j < 10; j++) {
            if (arrayOfField[i][j] != 0) {
                if (arrayOfField[i][j] <= 4 && arrayOfField[i][j] >= -4) {
                    // Рисуем корабль в 1 клетке
                    ctx.drawImage(imgShips[0], positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth, imgShipOneHeight);
                    // Рисуем пожар
                    if (arrayOfField[i][j] < 0)
                        ctx.drawImage(imgHit, positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth, imgShipOneHeight);

                } else if (arrayOfField[i][j] <= 7 && arrayOfField[i][j] >= -7) {
                    // Рисуем корабль в 2 клетках
                    if (j != 9 && (arrayOfField[i][j + 1] == arrayOfField[i][j] || arrayOfField[i][j + 1] == -arrayOfField[i][j])) {
                        //Рисуем корабль горизонтально
                        ctx.drawImage(imgShips[1], positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth * 2, imgShipOneHeight);
                    } else if (i != 9 && (arrayOfField[i + 1][j] == arrayOfField[i][j] || arrayOfField[i + 1][j] == -arrayOfField[i][j])) {
                        //Рисуем корабль вертикально
                        ctx.drawImage(imgShips[5], positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth, imgShipOneHeight * 2);
                    }

                    // Рисуем пожар
                    if (arrayOfField[i][j] < 0)
                        ctx.drawImage(imgHit, positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth, imgShipOneHeight);

                } else if (arrayOfField[i][j] <= 9 && arrayOfField[i][j] >= -9) {
                    // Рисуем корабль в 3 клетках 
                    if (j < 8 && (arrayOfField[i][j + 1] == arrayOfField[i][j] || arrayOfField[i][j + 1] == -arrayOfField[i][j]) && (arrayOfField[i][j + 2] == arrayOfField[i][j] || arrayOfField[i][j + 2] == -arrayOfField[i][j])) {
                        //Рисуем корабль горизонтально
                        ctx.drawImage(imgShips[2], positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth * 3, imgShipOneHeight);

                    } else if (i < 8 && (arrayOfField[i + 1][j] == arrayOfField[i][j] || arrayOfField[i + 1][j] == -arrayOfField[i][j]) && (arrayOfField[i + 2][j] == arrayOfField[i][j] || arrayOfField[i + 2][j] == -arrayOfField[i][j])) {
                        //Рисуем корабль вертикально
                        ctx.drawImage(imgShips[6], positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth, imgShipOneHeight * 3);
                    }

                    // Рисуем пожар
                    if (arrayOfField[i][j] < 0)
                        ctx.drawImage(imgHit, positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth, imgShipOneHeight);

                } else if (j < 7 && arrayOfField[i][j] != -100 && arrayOfField[i][j] <= 10) {
                    if ((arrayOfField[i][j + 1] == arrayOfField[i][j] || arrayOfField[i][j + 1] == -arrayOfField[i][j]) && (arrayOfField[i][j + 2] == arrayOfField[i][j] || arrayOfField[i][j + 2] == -arrayOfField[i][j]) && (arrayOfField[i][j + 3] == arrayOfField[i][j] || arrayOfField[i][j + 3] == -arrayOfField[i][j])) {
                        // Рисуем корабль в 4 клетках 
                        //Рисуем корабль горизонтально
                        ctx.drawImage(imgShips[3], positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth * 4, imgShipOneHeight);

                    } else if ((arrayOfField[i + 1][j] == arrayOfField[i][j] || arrayOfField[i + 1][j] == -arrayOfField[i][j]) && (arrayOfField[i + 2][j] == arrayOfField[i][j] || arrayOfField[i + 2][j] == -arrayOfField[i][j]) && (arrayOfField[i + 3][j] == arrayOfField[i][j] || arrayOfField[i + 3][j] == -arrayOfField[i][j])) {
                        // Рисуем корабль в 4 клетках 
                        //Рисуем корабль вертикально
                        ctx.drawImage(imgShips[7], positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth, imgShipOneHeight * 4);

                    }
                    
                    // Рисуем пожар
                    if (arrayOfField[i][j] < 0)
                        ctx.drawImage(imgHit, positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth, imgShipOneHeight);
                    
                } else if (arrayOfField[i][j] == -100) {
                    // Рисуем промах
                    ctx.drawImage(imgMiss, positionOfFirstCubeX + j * 52.9, positionOfFirstCubeY + i * 47.4, imgShipOneWidth, imgShipOneHeight);
                }
            }
        }
}

/* Рендер игрового поля */
function renderGameField() {
    if (ChangesOnPage) {
        ctx.clearRect(0, 0, ctx.width, ctx.height);
        // рендер поля игры
        ctx.drawImage(imgBackgroundGame, imgBackgroundGamePosX, imgBackgroundGamePosY,
            imgBackgroundGameWidth, imgBackgroundGameHeight);
        // рендер кнопки "новой игры"
        if (aimOnButtonNewGame)
            ctx.drawImage(imgNewGameChosen, imgNewGameChosenPosX, imgNewGameChosenPosY, imgNewGameChosenWidth, imgNewGameChosenHeight);
        else
            ctx.drawImage(imgNewGame, imgNewGamePosX, imgNewGamePosY, imgNewGameWidth, imgNewGameHeight);
        // рендер кораблей
        if (ShipsInGame) {
            renderShipsHitsMisses(arrayOfGameFieldPerson, positionOfFirstCubePersonX, positionOfFirstCubePersonY);
            renderShipsHitsMisses(arrayOfGameFieldPC, positionOfFirstCubePCX, positionOfFirstCubePCY);
        }
        // рендер курсора прицела на вражеском поле
        if (aimOnEnemyField) {
            renderCursorOnEnemyField();
        }
        ChangesOnPage = false;
    }
}

/* Установка всех игровых элементов */
function setUpAllGameElements() {
    // Подготовка элементов для механики игры
    // подготовка поля игры
    for (let i = 0; i < 10; i++) {
        arrayOfGameFieldPC[i] = new Array(10).fill(0);
        arrayOfGameFieldPerson[i] = new Array(10).fill(0);
    }

    for (let i = 0; i < 100; i++) {
        arrayOfEmpyPositionsPC[i] = i + 1;
        arrayOfEmpyPositionsPerson[i] = i + 1;
        arrayPositionsForPCBrain[i] = i + 1;
    }
}

/* Загрузка всех игровых картинок */
function setUpAllImg() {
    var imageShip;
    // Запись всех картинок для рендера
    // Запись всех картинок караблей
    for (let i = 1; i <= 4; i++) {
        imageShipH = new Image();
        imageShipH.src = srcImgs + "ship-" + i + "-horizontal.png";
        imgShips[i - 1] = imageShipH;
        imageShipV = new Image();
        imageShipV.src = srcImgs + "ship-" + i + "-vertical.png";
        imgShips[3 + i] = imageShipV;
    }
    // Запись остальных картинок
    imgAim.src = srcImgs + "aim.png";
    imgHit.src = srcImgs + "hit.png";
    imgMiss.src = srcImgs + "miss.png";
    imgBackgroundGame.src = srcImgs + "background-game-notebook.png";
    imgNewGame.src = srcImgs + "new-game.png";
    imgNewGameChosen.src = srcImgs + "new-game-chosen.png";

}

/* Рандом кораблей для игрового поля */
function randomAllShips(arrayOfField, arrayOfFieldEmptyPos, who) {
    /*
        Ставит корбли с собственным id 
        1 корабль - 4 клетки
        2 корабля - 3 клетки
        3 корабля - 2 клетки
        4 корабля - 1 клетка
    */
    let idForShips = 10;
    let ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    let countSearchForPlace = 0;
    let tempArrayOfFieldEmptyPos = arrayOfFieldEmptyPos;

    // рандом позиции кораблей
    while (countSearchForPlace < ships.length) {
        let lengthOfShip = ships[countSearchForPlace];
        let canPlaceShip = true;

        // Проверка, как именно ставим корабль
        let placeShipHorizontal = false;
        let placeShipVertical = false;

        // Берем рандомную свободную позицию
        let randPosInField = GetRandomInt(0, (tempArrayOfFieldEmptyPos.length - 1));
        // Находим ее в поле игры
        let [x, y] = findPositionFrom1Dto2D(tempArrayOfFieldEmptyPos[randPosInField]);

        /*
            Рандомим возможность постановки корабля
            1 - горизонтально, если не вышло, то вертикально
            2 - вертикально, если не вышло, горизонтально
        */
        let placeByRandom = GetRandomInt(1, 2);

        // Ставим сначала горизонтально, если не получается, то вертикально
        if (placeByRandom == 1) {
            // Поиск места горизонтально около выбранной позиции
            [placeShipHorizontal, x] = checkIfCanPlaceShipHorizontal(lengthOfShip, arrayOfField, x, y);
            // Если не можем поставить корабль горизонтально около выбранной позиции
            // Ищем, можем ли поставить его вертикально около выбранной позиции
            if (!placeShipHorizontal)
                [placeShipVertical, y] = checkIfCanPlaceShipVertical(lengthOfShip, arrayOfField, x, y);
        } else {
            // Ставим сначала вертикально, если не получается, то горизонтально
            [placeShipVertical, y] = checkIfCanPlaceShipVertical(lengthOfShip, arrayOfField, x, y);
            if (!placeShipVertical)
                [placeShipHorizontal, x] = checkIfCanPlaceShipHorizontal(lengthOfShip, arrayOfField, x, y);
        }

        // если нашли место, ставим корабль
        if (placeShipHorizontal || placeShipVertical) {
            let positiongForDeleting = 0;
            // Ставим горизонтально корабль
            if (placeShipHorizontal) {
                for (let i = 0; i < lengthOfShip; i++)
                    if (who == "Person")
                        arrayOfField[y][x + i] = idForShips;
                    else
                        arrayOfField[y][x + i] = idForShips + 10;

                // Убираем свободные позиции, в которые записали корабль
                // для будущего рандома других кораблей
                let notMoreEmptyPosition = findPositionFrom2Dto1D(x, y) + 1;
                arrayOfFieldEmptyPos.splice(arrayOfFieldEmptyPos.indexOf(notMoreEmptyPosition), 4);
            }

            // Ставим вертикально корабль
            if (placeShipVertical) {
                for (let i = 0; i < lengthOfShip; i++)
                    if (who == "Person")
                        arrayOfField[y + i][x] = idForShips;
                    else
                        arrayOfField[y + i][x] = idForShips + 10;


                // Убираем свободные позиции, в которые записали корабль
                // для будущего рандома других кораблей
                let notMoreEmptyPosition = findPositionFrom2Dto1D(x, y) + 1;
                for (let i = 0; i < lengthOfShip; i++) {
                    arrayOfFieldEmptyPos.splice(arrayOfFieldEmptyPos.indexOf(notMoreEmptyPosition + (i * 10)), 1);
                }
            }

            tempArrayOfFieldEmptyPos = arrayOfFieldEmptyPos;
            countSearchForPlace++;
            idForShips--;

        } else {
            // Если не получилось поставить корабль в данную точку, то исключаем ее 
            // В следующих пробегах
            let notMoreEmptyPosition = findPositionFrom2Dto1D(x, y);
            tempArrayOfFieldEmptyPos.splice(arrayOfFieldEmptyPos.indexOf(notMoreEmptyPosition), 1);
        }
    }
    // Можно посмотреть поле Пользователя и ПК
    console.log(arrayOfField);
}

/*
    Определяет, можно ли поставить корабль горизонтально точки
 */
function checkIfCanPlaceShipHorizontal(tempLengthOfShip, tempArrayOfField, X, Y) {
    let canPlaceShip = true;

    for (let j = 0; j < tempLengthOfShip; j++) {
        canPlaceShip = true;

        for (let i = 0; i < tempLengthOfShip; i++) {
            // Чтобы не заходить вне массива
            if ((X - i + j) < 10 && (X - i + j) >= 0) {
                if (tempArrayOfField[Y][X - i + j] != 0)
                    canPlaceShip = false;
            } else {
                canPlaceShip = false;
            }

            // Если нашли место для корабля, записываем начальную позицию корабля
            if (canPlaceShip && (i == (tempLengthOfShip - 1))) {
                placeShipHorizontal = true;
                X = X - i + j;
            }
        }

        // Нашли место для корабля
        if (canPlaceShip) {
            return ([true, X])
        }
    }

    // Нельзя поставить
    return ([false, X]);
}

// Определяет, можно ли поставить корабль вертикально точки
function checkIfCanPlaceShipVertical(lengthOfShip, arrayOfField, x, y) {
    let canPlaceShip = true;

    for (let j = 0; j < lengthOfShip; j++) {
        canPlaceShip = true;

        for (let i = 0; i < lengthOfShip; i++) {
            // Чтобы не заходить вне массива
            if ((y - i + j) < 10 && (y - i + j) >= 0) {
                if (arrayOfField[y - i + j][x] != 0)
                    canPlaceShip = false;
            } else {
                canPlaceShip = false;
            }

            // Если нашли место для корабля, записываем начальную позицию корабля
            if (canPlaceShip && (i == (lengthOfShip - 1))) {
                y = y - i + j;
            }
        }

        // Нашли место для корабля
        if (canPlaceShip) {
            return ([true, y])
        }
    }
    return ([false, y]);
}

/* Проверяет, кто победил */
function checkWhoWon(arrayOfField, who) {
    let someOneWON = true;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (arrayOfField[i][j] > 0)
                someOneWON = false;
        }
        if (!someOneWON)
            break;
    }

    if (someOneWON)
        if (who == "Person") {
            // Победил человек
            console.log("Won Person");
            GameFinished = true;
        } else {
            // Победил ПК
            console.log("Won PC");
            GameFinished = true;
        }
}

/* Определить позицию из 1-мерного в 2-мерном пространстве */
function findPositionFrom1Dto2D(position) {
    let x, y;
    if (position >= 10)
        y = Math.trunc((position - 1) / 10);
    else
        y = 0;
    x = (position - 1) % 10;
    return [x, y];
}

/* Определить позицию из 2-мерного в 1-мерном пространстве */
function findPositionFrom2Dto1D(x, y) {
    return (y * 10 + x + 1);
}

/* Игрок целиться с возможностью выстрелить */
function makeAimOnEnemyField(event, click) {
    let x = event.offsetX;
    let y = event.offsetY;
    // Игрок целит по вражескому полю
    if (x >= positionOfFirstCubePCX && x <= (positionOfFirstCubePCX + widthGameFieldPCX) && y >= positionOfFirstCubePCY && y <= (positionOfFirstCubePCY + widthGameFieldPCY)) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (x >= (positionOfFirstCubePCX + j * 52.9) && x <= (positionOfFirstCubePCX + j * 52.9 + imgShipOneWidth) && y >= (positionOfFirstCubePCY + i * 47.4) && y <= (positionOfFirstCubePCY + i * 47.4 + imgShipOneHeight)) {
                    aimOnEnemyField = true;
                    ChangesOnPage = true;
                    positionAimX = j;
                    positionAimY = i;
                    // Игрок стреляет по ПК
                    if (click) {
                        console.log(arrayOfGameFieldPC);
                        if (arrayOfGameFieldPC[i][j] >= 0) {
                            // Игрок попал по кораблю или промахнулся ПК
                            makeFire(arrayOfGameFieldPC, positionAimX, positionAimY, "Person");
                            ChangesOnPage = true;
                            makeMoveForPc();
                        }
                    }
                }
            }
        }
    }
}

/* Стрельба по кораблю */
function makeFire(arrayOfField, x, y, who) {
    if (arrayOfField[y][x] != 0)
        if (arrayOfField[y][x] > 10 && arrayOfField[y][x] <= 20) {
            arrayOfField[y][x] = -arrayOfField[y][x] + 10;
        } else {
            arrayOfField[y][x] = -arrayOfField[y][x];
        }
    else arrayOfField[y][x] = -100; // Промах
    checkWhoWon(arrayOfField, who)
}

/* Ход Пк */
function makeMoveForPc() {
    let x, y;
    let randomPositionForMove, randCoor;
    // ПК не знает, куда ходить
    if (lastPCmove[0] == -1) {
        // Пк выбирает рандомную координаты
        randCoor = GetRandomInt(0, arrayPositionsForPCBrain.length - 1);
        randomPositionForMove = arrayPositionsForPCBrain[randCoor];
        [x, y] = findPositionFrom1Dto2D(randomPositionForMove);
    } else {
        // ПК попал по кораблю, который больше, чем одна клетка
        [x, y] = lastPCmove;
        randomPositionForMove = findPositionFrom2Dto1D(x, y);
    }

    // Проверяем, куда будет выстрел
    // Делается на рандоме
    if (lastPCmove[0] == -1) {
        wherePCgoes = 1;
        if (arrayOfGameFieldPerson[y][x] >= 5 && arrayOfGameFieldPerson[y][x] <= 7) {
            // Попали в одну часть 2-клеточного корабля
            lastPCmove = [x, y];
            howMuchDestroyForPc = 1;
        } else if (arrayOfGameFieldPerson[y][x] >= 8 && arrayOfGameFieldPerson[y][x] <= 9) {
            // Попали в одну часть 3-клеточного корабля
            lastPCmove = [x, y];
            howMuchDestroyForPc = 2;
        } else if (arrayOfGameFieldPerson[y][x] == 10) {
            // Попали в одну часть 4-клеточного корабля
            lastPCmove = [x, y];
            howMuchDestroyForPc = 3;
        } else {
            // ПК попал мимо, либо уничтожил 1-клеточный корабль
            // Не знает, куда ему сходить, берет рандом в след ход
            lastPCmove = [-1, -1];
        }
        // Исключаем эту точку из следующих действий ПК
        arrayPositionsForPCBrain.splice(arrayPositionsForPCBrain.indexOf(randomPositionForMove), 1);
        makeFire(arrayOfGameFieldPerson, x, y, "Pc");
    } else {
        // Поиск остальной части корабля
        switch (wherePCgoes) {
            case 1:
                // поиск сверху
                // Сверху граница, ищем снизу
                if (y == 0) {
                    wherePCgoes = 2;
                    makeMoveForPc();
                } else {
                    if (arrayOfGameFieldPerson[y - 1][x] > 0) {
                        if (howMuchDestroyForPc == 1) {
                            // Уничтожили 2-кл корабль, ищем снова на рандоме
                            lastPCmove = [-1, -1];
                        } else if (howMuchDestroyForPc > 1) {
                            lastPCmove = [x, y - 1];
                            howMuchDestroyForPc--;
                        }
                        // Исключаем эту точку из следующих действий ПК
                        randomPositionForMove = findPositionFrom2Dto1D(x, y - 1);
                        arrayPositionsForPCBrain.splice(arrayPositionsForPCBrain.indexOf(randomPositionForMove), 1);
                        makeFire(arrayOfGameFieldPerson, x, y - 1, "Pc");
                    } else if (arrayOfGameFieldPerson[y - 1][x] == 0) {
                        // промах
                        wherePCgoes = 2;
                        // Исключаем эту точку из следующих действий ПК
                        randomPositionForMove = findPositionFrom2Dto1D(x, y - 1);
                        arrayPositionsForPCBrain.splice(arrayPositionsForPCBrain.indexOf(randomPositionForMove), 1);
                        makeFire(arrayOfGameFieldPerson, x, y - 1, "Pc");
                    } else {
                        // Клетка уже была взаимодействованна раньше
                        wherePCgoes = 2;
                        makeMoveForPc();
                    }
                }
                break;
            case 2:
                // поиск снизу
                // Снизу граница, ищем слева
                if (y == 9) {
                    wherePCgoes = 3;
                    makeMoveForPc();
                } else {
                    if (arrayOfGameFieldPerson[y + 1][x] > 0) {
                        if (howMuchDestroyForPc == 1) {
                            // Уничтожили 2-кл корабль, ищем снова на рандоме
                            lastPCmove = [-1, -1];
                        } else if (howMuchDestroyForPc > 1) {
                            lastPCmove = [x, y + 1];
                            howMuchDestroyForPc--;
                        }
                        // Исключаем эту точку из следующих действий ПК
                        randomPositionForMove = findPositionFrom2Dto1D(x, y + 1);
                        arrayPositionsForPCBrain.splice(arrayPositionsForPCBrain.indexOf(randomPositionForMove), 1);
                        makeFire(arrayOfGameFieldPerson, x, y + 1, "Pc");
                    } else if (arrayOfGameFieldPerson[y + 1][x] == 0) {
                        // промах
                        wherePCgoes = 3;
                        // Исключаем эту точку из следующих действий ПК
                        randomPositionForMove = findPositionFrom2Dto1D(x, y + 1);
                        arrayPositionsForPCBrain.splice(arrayPositionsForPCBrain.indexOf(randomPositionForMove), 1);
                        makeFire(arrayOfGameFieldPerson, x, y + 1, "Pc");
                    } else {
                        // Клетка уже была взаимодействованна раньше
                        wherePCgoes = 3;
                        makeMoveForPc();
                    }
                }


                break;
            case 3:
                // поиск слева
                // Слева граница, ищем справа
                if (x == 0) {
                    wherePCgoes = 4;
                    makeMoveForPc();
                } else {
                    if (arrayOfGameFieldPerson[y][x - 1] > 0) {
                        if (howMuchDestroyForPc == 1) {
                            // Уничтожили 2-кл корабль, ищем снова на рандоме
                            lastPCmove = [-1, -1];
                        } else if (howMuchDestroyForPc > 1) {
                            lastPCmove = [x - 1, y];
                            howMuchDestroyForPc--;
                        }
                        // Исключаем эту точку из следующих действий ПК
                        randomPositionForMove = findPositionFrom2Dto1D(x - 1, y);
                        arrayPositionsForPCBrain.splice(arrayPositionsForPCBrain.indexOf(randomPositionForMove), 1);
                        makeFire(arrayOfGameFieldPerson, x - 1, y, "Pc");
                    } else if (arrayOfGameFieldPerson[y][x - 1] == 0) {
                        // промах
                        wherePCgoes = 4;
                        // Исключаем эту точку из следующих действий ПК
                        randomPositionForMove = findPositionFrom2Dto1D(x - 1, y);
                        arrayPositionsForPCBrain.splice(arrayPositionsForPCBrain.indexOf(randomPositionForMove), 1);
                        makeFire(arrayOfGameFieldPerson, x - 1, y, "Pc");
                    } else {
                        // Клетка уже была взаимодействованна раньше
                        wherePCgoes = 4;
                        makeMoveForPc();
                    }
                }
                break;
            case 4:
                // поиск справа
                // Справа граница, ищем сверху
                if (x == 9) {
                    wherePCgoes = 1;
                    makeMoveForPc();
                } else {
                    if (arrayOfGameFieldPerson[y][x + 1] > 0) {
                        if (howMuchDestroyForPc == 1) {
                            // Уничтожили 2-кл корабль, ищем снова на рандоме
                            lastPCmove = [-1, -1];
                        } else if (howMuchDestroyForPc > 1) {
                            lastPCmove = [x + 1, y];
                            howMuchDestroyForPc--;
                        }
                        // Исключаем эту точку из следующих действий ПК
                        randomPositionForMove = findPositionFrom2Dto1D(x + 1, y);
                        arrayPositionsForPCBrain.splice(arrayPositionsForPCBrain.indexOf(randomPositionForMove), 1);
                        makeFire(arrayOfGameFieldPerson, x + 1, y, "Pc");
                    } else if (arrayOfGameFieldPerson[y][x + 1] == 0) {
                        // промах
                        wherePCgoes = 1;
                        // Исключаем эту точку из следующих действий ПК
                        randomPositionForMove = findPositionFrom2Dto1D(x + 1, y);
                        arrayPositionsForPCBrain.splice(arrayPositionsForPCBrain.indexOf(randomPositionForMove), 1);
                        makeFire(arrayOfGameFieldPerson, x + 1, y, "Pc");
                    } else {
                        // Клетка уже была взаимодействованна раньше
                        lastPCmove = [-1, -1];
                        makeMoveForPc();
                    }

                }
                break;
        }
    }
}

//////////////////////////////////// Events ///////////////////////////////////////////

/* Загрузка страницы */
document.addEventListener('DOMContentLoaded', function () {
    ctx = document.querySelector(".game").getContext('2d');
    ChangesOnPage = true;
    // Загрузка всех игрровых изображений 
    setUpAllImg();
    // Установка основных элементов игры
    setUpAllGameElements();
    // Рендер игрового поля
    // Используем таймер, чтобы дать подгрузиться
    // всем картинкам для рендера
    Timer = setInterval(renderGameField, 80);
})

/* Клик по игровому полю и кнопке */
document.addEventListener("click", function (e) {
    let x = e.offsetX;
    let y = e.offsetY;
    // Пользователь кликнул на "Новая игра"
    if (x > imgNewGamePosX && x < (imgNewGamePosX + imgNewGameWidth) &&
        y > imgNewGamePosY && y < (imgNewGamePosY + imgNewGameHeight)) {
        setUpAllGameElements();
        // Рандом поле Игрока
        randomAllShips(arrayOfGameFieldPerson, arrayOfEmpyPositionsPerson, "Person");
        // Рандом поле ПК
        randomAllShips(arrayOfGameFieldPC, arrayOfEmpyPositionsPC, "PC");
        ShipsInGame = true;
        ChangesOnPage = true;
        GameFinished = false;
    }
    if (!GameFinished)
        makeAimOnEnemyField(e, true);
});

/* Проверка, куда навелся пользователь при передвежении мыши */
document.addEventListener('mousemove', function (e) {
    let x = e.offsetX;
    let y = e.offsetY;
    // Пользователь навел курсор на "Новая игра"
    if (x > imgNewGamePosX && x < (imgNewGamePosX + imgNewGameWidth) &&
        y > imgNewGamePosY && y < (imgNewGamePosY + imgNewGameHeight)) {
        if (!aimOnButtonNewGame) {
            aimOnButtonNewGame = true;
            ChangesOnPage = true;
        }
    } else {
        if (aimOnButtonNewGame) {
            aimOnButtonNewGame = false;
            ChangesOnPage = true;
        }
        if (!GameFinished)
            makeAimOnEnemyField(e, false);
    }
});

//////////////////////////////////// Patterns /////////////////////////////////////////

// Рандом целого числа
function GetRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}
