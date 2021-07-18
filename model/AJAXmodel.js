'use strict';
var ajaxHandlerScript="http://fe.it-academy.by/AjaxStringStorage2.php";
var updatePassword;
var stringName='SAKALOU_SKYSCRAPERS_RECORDS';
let context = null;
let userName = null;
let lastRecords = [];
let points = null;

restoreInfo();

function restoreInfo() {
    $.ajax(
        {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'READ', n : stringName },
            success : readReady, error : errorHandler,
        }
    );
}


function readReady(callresult) {
    if ( callresult.error!=undefined )
         alert(callresult.error);
     else if ( callresult.result!="" ) {
         lastRecords=JSON.parse(callresult.result);
         console.log(lastRecords);
    }
}

function storeInfo(self) {
    points = self.myGame.points;
    updatePassword=Math.random();
    $.ajax( {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'LOCKGET', n : stringName, p : updatePassword },
            success : lockGetReady, error : errorHandler
        }
    );
}

function lockGetReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        console.log(lastRecords.some(isRecordMax));
      if (lastRecords.some(isRecordMax) || lastRecords.length < 10){
        setTimeout(modalWindow, 1000);
      }
       else {
            return;
          }
    }
}

function updateReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
}

let isRecordMax = (V, I, A) => {return points > V["point"]};                //функция-стрелка проверки попадает ли рекорд в топ 10

function modalWindow() {
  document.querySelector('.main-field').style.display = 'none';                                               //вывод модального окна с задержкой
  document.querySelector('.record-background').style.display = 'block';
}

function recordOfPoints(points, arrOfPoints) {                                         // функция записи рекорда
    userName = document.getElementById('name').value;
    if (!userName){
      console.log(arrOfPoints);
      alert("Вы не ввели своё имя!");
      return;
    }
    if (arrOfPoints.some(isRecordMax)){
      for (let i = 0; i <arrOfPoints.length; i++){
         if (points > arrOfPoints[i]["point"]){
           let arrOfRec = arrOfPoints.splice(i, (arrOfPoints.length - i));                  // вариант через методы массива
           arrOfPoints[i] = {name : userName, point : points};
           arrOfPoints = arrOfPoints.concat(arrOfRec);
           if (arrOfPoints.length > 10){
             arrOfPoints.pop();
           }
           break;
         }
       }
     }
    else {
      arrOfPoints.push({name : userName, point : points});
    }
    document.querySelector('.record-background').style.display = '';
    document.querySelector('.main-field').style.display = 'block';
    updateAJAX(arrOfPoints);
    return lastRecords = arrOfPoints;
  }

function updateAJAX(lastRecords){
  $.ajax( {
          url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
          data : { f : 'UPDATE', n : stringName, v : JSON.stringify(lastRecords), p : updatePassword },
          success : updateReady, error : errorHandler
      }
  );
}