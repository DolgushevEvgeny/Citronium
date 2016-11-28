
//function checkEnd() {
//    if (gameField[0]=='ai' && gameField[1]=='ai' && gameField[2]=='ai' || gameField[0]=='player' && gameField[1]=='player' && gameField[2]=='player')  return true;
//    if (gameField[3]=='ai' && gameField[4]=='ai' && gameField[5]=='ai' || gameField[3]=='player' && gameField[4]=='player' && gameField[5]=='player')  return true;
//    if (gameField[6]=='ai' && gameField[7]=='ai' && gameField[8]=='ai' || gameField[6]=='player' && gameField[7]=='player' && gameField[8]=='player')  return true;
//    if (gameField[0]=='ai' && gameField[3]=='ai' && gameField[6]=='ai' || gameField[0]=='player' && gameField[3]=='player' && gameField[6]=='player')  return true;
//    if (gameField[1]=='ai' && gameField[4]=='ai' && gameField[7]=='ai' || gameField[1]=='player' && gameField[4]=='player' && gameField[7]=='player')  return true;
//    if (gameField[2]=='ai' && gameField[5]=='ai' && gameField[8]=='ai' || gameField[2]=='player' && gameField[5]=='player' && gameField[8]=='player')  return true;
//    if (gameField[0]=='ai' && gameField[4]=='ai' && gameField[8]=='ai' || gameField[0]=='player' && gameField[4]=='player' && gameField[8]=='player')  return true;
//    if (gameField[2]=='ai' && gameField[4]=='ai' && gameField[6]=='ai' || gameField[2]=='player' && gameField[4]=='player' && gameField[6]=='player')  return true;
//    if(gameField[0] && gameField[1] && gameField[2] && gameField[3] && gameField[4] && gameField[5] && gameField[6] && gameField[7] && gameField[8]) return true;
//}

var cellID;
function move(id, idRow, idColumn) {
    if (canPlay) {
        cellID = id;
        var params = {
            url: "http://localhost:8888/make_a_move",
            type: "POST",
            dataType: "json",
            data: { row: idRow, col: idColumn,
                game_token: gameToken,
                access_token: accessToken },
            success: onResponseSuccess,
            error: onResponseError
        };

        $.ajax(params);
    }
}