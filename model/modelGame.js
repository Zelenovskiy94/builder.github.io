'use strict';

function modelGame() {
    let self = this;
    self.timer = 0;
    self.hangingBlockAngle = null;
    self.groupAngle = null;
    self.area = document.getElementById('field');
    let angleForCount = null;                         //угол для рассчета качания группы
    let kOfDeltaPosX = .02;
    self.hangingBuildingAngle = null;           // угол качания здания
    self.hangingBlockAngle = null;                           //угол качания висячего элемента
    let kRocking = null;                              //коэф качания дома
    let kOfRock = .5;                               //коэф увеличения качания дома
    self.points = 0;                               //
    let RequestAnimationFrame = null;
    let CancelAnimationFrame = null;
    self.signToDownBack = false;                                                 //старт опускать фон
    self.backgroundSound = document.getElementById('background');
    self.bingoSound = document.getElementById('bingo');
    self.slipSound = document.getElementById('slip');
    self.overSound = document.getElementById('over');
    self.bellSound = document.getElementById('bell');


    RequestAnimationFrame =
          // находим, какой requestAnimationFrame доступен
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          // ни один не доступен - будем работать просто по таймеру
          function (callback) {
              TimerId = window.setTimeout(callback, 1000 / 60);
          };

    CancelAnimationFrame =
          window.cancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          window.oCancelAnimationFrame ||
          window.msCancelAnimationFrame;

    //фон
    self.addBackground = function() {
      self.viewBackgroundMain = new viewBackground();
      self.viewBackgroundMain.start( self.area, game);
    }

   self.start = function() {
     if(startFlag) {
       startFlag = false;                                    // больше не будет запускаться при повторном нажатии на старт!
        while (self.area.firstChild) {
            self.area.removeChild(self.area.firstChild);
            self.blocksModelH.length = 0;
            self.blocksViewH.length = 0;
            self.blocksControllerH.length = 0;
        }
        while(self.countOfBlocks.value()!=0){
            self.countOfBlocks.minus();
        }
        if(!nextLevelFlag){
            kOfDeltaPosX += .04;                                                //увеличениу коэф, отвечающего за положение качающегося здания по горизонтали
            kOfRock += 1;                                                   // увеличениу коэф, отвечающего за частоту качания здания
       }
       else {
         self.newLevelPic(numberOfLevel);                                     //заставка первого уровня
       }
         angleForCount = 0;
         kRocking = .1;
         self.addBackground();
         self.addCable();
         self.addBlock();
         self.tick();
         self.viewBackgroundMain.pointsPlus(self.points);                   //кол-во очков в начале игры (на следующих уровнях)
         if (self.countOfRemovesBlock.value() > 0){
           currentHearts(self.countOfRemovesBlock.value());
         }
     }
      return;
    }

    // sounds
    self.soundPlay = function(sound){
      sound.currentTime = 0;
      sound.play();
    }

    self.soundStop = function(sound){
      sound.pause();
    }

    //vibro

    self.vibro = function(longFlag) {
        if ( navigator.vibrate ) { // есть поддержка Vibration API?
            if ( longFlag )
                window.navigator.vibrate(100); // вибрация 100мс
            else
                window.navigator.vibrate(500); // вибрация 3 раза по 100мс с паузами 50мс
        }
    }

    self.newLevelPic = (nl) => {                                        //показываем заставку
      let divLevel = document.querySelector('.new-level');
      divLevel.innerHTML = '<span>Level '+nl+'</span>';
      divLevel.style.display = 'block';
      document.querySelector('.main-menu-bottom').style.display = "none";
      self.soundPlay(self.bellSound);
      setTimeout(self.newLevelNone, 2500, divLevel);
    }

    let currentHearts = (countOfHearts) => {                               //перекрашиваем сердечки в соответствии с текущей ситуацией
      for (let i = 0; i < countOfHearts; i++){
        self.viewBackgroundMain.changeHeart((i+1));
      }
    }

    self.newLevelNone = (div) => {
      div.style.display = 'none';
     document.querySelector('.main-menu-bottom').style.display = "block";
     self.soundPlay(self.backgroundSound);
   }                //скрываем заставку уровня

    // трос
    self.addCable = function() {
      self.modelCableMain = new modelCable();
      self.viewCableMain = new viewCable();

      self.modelCableMain.start(self.viewCableMain);
      self.viewCableMain.start(self.modelCableMain, self.area, game);
    }

    // массивы блоков
    self.blocksModelH = [];
    self.blocksViewH = [];
    self.blocksControllerH = [];

    // добавляем блоки
    self.addBlock = function() {
      console.log(self.blocksModelH);
      self.modelBlockMain = new modelBlock();
      self.blocksModelH.push(self.modelBlockMain);

      self.viewBlockMain = new viewBlock();
      self.blocksViewH.push(self.viewBlockMain);

      self.controllerBlockMain = new controllerGame();
      self.blocksControllerH.push(self.controllerBlockMain);

      self.countOfBlocks.plus(); //счетчик блоков

      self.viewBlockMain.start(self.modelBlockMain, self.area, game, self.modelCableMain);
      self.modelBlockMain.start(self.viewBlockMain, self.area, self.modelCableMain, game, self.viewBackgroundMain);
      self.controllerBlockMain.start(self.modelBlockMain, self.area, self.modelCableMain);

       kRocking += kOfRock;
    }

    self.countOfBlocks = (function() {                              //Счетчик блоков
      let count = 0;
       function changeCount(value) {
        count += value;
      }
      return {
        plus: function(){
          changeCount(1);
        },
        minus: function(){
          changeCount(-1);
        },
        value: function() {
          return count;
        }
      }
    })();

    self.countOfRemovesBlock = (function() {                              //Счетчик промахнувшихся блоков
      let count = 0;
       function changeCount(value) {
        count += value;
      }
      return {
        plus: function(){
          changeCount(1);
        },
        value: function() {
          return count;
        }
      }
    })();

     self.position = function(el, I, arr) {             //обновляет позиции эл-ов, удаляет duration через forEach, перемещает упавшие блоки по горизонтали
       el.blockPositions();
       if (el.flagForBingo == false){
          el.myView.x();
        }
     }

     self.down = function(){                                         //блоки вниз
       self.blocksViewH.forEach(self.blocksDown);
     }

     self.backgroundDown = function() {                               //фон вниз
      self.signToDownBack = true;
     }

     self.blocksDown = function(el, I, arr){                         //блоки вниз
       if(arr[I].class == 'down'){
         arr[I].distanceBlockVertical = arr[I].height;
       }
     }



     self.vertical = function(el, I, arr) {             //обновляет позиции эл-ов вниз
       if (arr[I].distanceBlockVertical){
          el.y();                                       //вызов метода в текущем объекте
       }
     }


    self.tick = function() {                                                 //функция , которую постоянно вызывает счетчик
      if (self.timer){
        if (typeof RequestAnimationFrame === 'function')
            clearInterval(self.timer);
        else
            CancelAnimationFrame(self.timer);
        self.timer = 0;
      }

      angleForCount += kOfDeltaPosX;
      self.posX2 =400 + kRocking*Math.sin(angleForCount);                  //опорная точка здания

      self.hangingBlockAngle = -180*Math.atan((self.modelCableMain.posX2-self.modelCableMain.posX1)/(self.modelCableMain.posY2-self.modelCableMain.posY1))/Math.PI;  //угол поворота висячего блока завязан с углом троса
      self.modelCableMain.cablePosition();

      self.blocksModelH.forEach(self.position);                   //обновляет позиции эл-ов
         self.blocksViewH.forEach(self.vertical);                   //обновляет позиции эл-ов
         if(self.signToDownBack){
           self.viewBackgroundMain.backgroundDownStart(self.modelBlockMain.height);                   //обновляет позиции эл-ов передаем высоту блока
         }

      if (self.blocksModelH.length == 7){                      // 5 объектов остается в итерации
           self.blocksModelH.splice(0, 1);
           self.blocksViewH.splice(0, 1);
          self.blocksControllerH.splice(0, 1);
      }
      if (startFlag){
        return;
      }
      if (typeof requestAnimationFrame === 'function'){
        requestAnimationFrame(self.tick);
      }
      else {
        self.timer = requestAnimationFrame(self.tick);
      }

    }
}