'use strict';

  function modelBlock() {
    let self = this;
    if (document.documentElement.clientWidth> 750){
      self.fieldWidth = 700;                                                    //ширина поля
    }
    else{
      self.fieldWidth = document.documentElement.clientWidth-20;
    }
    self.fieldHeight = 550;
    self.height = 72;                                                    //размер блока
    self.width = 70;
    self.speedDown = 3;                                                // начальная скорость
    self.accelDown = .18;                                           //ускорение падения блоков
    self.speedDownSlow = 4;
    self.speedHorizont = 2;
    self.class = "up";
    self.rotate = 0;
    self.posX = null;
    self.posY = null;
    self.angleOne = 0.01/180*Math.PI;
    self.flagForBingo = true;                                     //флаг
    self.posXForBuilding = null;
    self.flagBumpLeft= true;
    self.flagBumpRight= true;
    self.r = 0;
    self.name = null;
    let angleOne = 0;
  }

    modelBlock.prototype.start = function(view, field, cable, game, background) {
      let self = this;
                  self.myView = view;
                  self.myField = field;
                  self.myCable = cable;
                  self.myGame = game;
                  self.background = background;
                  // self.myGame.countOfBlocks.plus();
                  self.id = self.myGame.countOfBlocks.value();
                  self.myView.updateId();
                  self.currentBlock = document.getElementById(self.id);                   //доступ к текущему блоку
                  self.myGame.groupPointY += self.height;
                  self.posX = self.myCable.posX2;
                  self.posY = self.myCable.posY2;
                  self.rotatePosX = self.posX;
                  self.rotatePosY = self.posY;
                  if (self.id > 1){
                    self.previousBlock = document.getElementById(self.id-1);        //доступ к предыдущему блоку
                  }
                }

    modelBlock.prototype.blockPositions = function(){
let self = this;
      if (self.class == 'down' && self.flagForBingo == true) {
          self.myView.update();
          if(self.flagBumpLeft == false){
                  self.posX +=self.speedHorizont;
                  self.posY +=self.speedDownSlow;
                  self.r+=1.5; // 1 градус за кадр
                  self.myView.snaggedBlock();
          } else if (self.flagBumpRight == false){
                  self.posX -=self.speedHorizont;
                  self.posY +=self.speedDownSlow;
                  self.r-=1.5; // 1 градус за кадр
                  self.myView.snaggedBlock();
          } else {
                  self.posX = self.posX;
                  self.speedDown +=self.accelDown;
                  self.posY +=self.speedDown;
          }

          if (self.posY >= self.fieldHeight-(self.height*2.2) && self.id == 1 && self.flagForBingo == true){    //упал первый блок
                  self.myGame.soundPlay(self.myGame.bingoSound);
                  self.myGame.vibro(true);
                  self.posXForBuilding = self.currentBlock.getBBox().x-self.myGame.posX2;
                  self.flagForBingo = false;
                  // self.speedDown = 0;
                  self.posY = self.fieldHeight-(self.height*2.2);
                  self.myGame.points +=self.id;
                  self.background.pointsPlus(self.myGame.points);  //прибавляем очки
                  self.myView.update();
                  self.createNewBlock();
          }

          else if (self.id > 1 && self.posY > (self.previousBlock.getBBox().y - self.height) &&    //блок попал (bingo)
                  self.posY < (self.previousBlock.getBBox().y - self.height*.8) &&
                  (self.currentBlock.getBBox().x) >= (self.previousBlock.getBBox().x - self.width/2) &&
                  (self.currentBlock.getBBox().x) <= (self.previousBlock.getBBox().x + self.width/2)){
                    self.myGame.soundPlay(self.myGame.bingoSound);
                    self.myGame.vibro(true);
                    self.posY = self.previousBlock.getBBox().y-self.height;
                    self.myView.update();
                    self.myGame.points +=1;
                    self.background.pointsPlus(self.myGame.points);  //прибавляем очки
                    if (self.id == self.myView.idLastBlock){              //переход на новый уровень
                      startFlag = true;
                      nextLevelFlag = false;
                      numberOfLevel +=1;
                      self.myGame.soundStop(self.myGame.backgroundSound);                  //выкл звук
                      self.flagForBingo = true;
                      setTimeout(self.myGame.start, 1000);
                      setTimeout(self.myGame.newLevelPic, 1000, numberOfLevel);
                      return;
                    }
                    self.posXForBuilding = self.currentBlock.getBBox().x-self.myGame.posX2;
                    self.flagForBingo = false;
                    self.speedDown = 0;
                    self.myGame.backgroundDown();                                //опускаем фон
                    self.myGame.down();                                           //опускаем блоки
                    // if (self.myView.blockWindow){
                    //   console.log(self.myView.blockWindow);
                    // setTimeout(self.myView.lightWindow, 300, self.myView.blockWindow);
                    // }
                    self.myView.lightWindow();
                    self.createNewBlock();
                  }
          else if (self.id > 1 && self.posY > (self.previousBlock.getBBox().y - self.height) &&    //блок зацепил
                  self.posY < (self.previousBlock.getBBox().y - self.height*.8) &&
                  (self.currentBlock.getBBox().x) < (self.previousBlock.getBBox().x + self.width) &&
                  (self.currentBlock.getBBox().x) > (self.previousBlock.getBBox().x + self.width/2)){
                    self.flagBumpLeft = false;
            }
          else if (self.id > 1 && self.posY > (self.previousBlock.getBBox().y - self.height) &&    //блок зацепил
                  self.posY < (self.previousBlock.getBBox().y - self.height*.8) &&
                  (self.currentBlock.getBBox().x) > (self.previousBlock.getBBox().x - self.width) &&
                  (self.currentBlock.getBBox().x) < (self.previousBlock.getBBox().x - self.width/2)){
                      self.flagBumpRight = false;
            }
          else if (self.posY > self.fieldHeight + .1*self.height){    //блок промахнулся
                  console.log('промахнулся');
                  self.myGame.soundPlay(self.myGame.slipSound);
                  self.myGame.vibro(false);
                  self.flagForBingo = false;
                  self.myGame.blocksModelH.splice(self.myGame.blocksModelH.length-1, 1);
                  self.myGame.blocksViewH.splice(self.myGame.blocksViewH.length-1, 1);
                  // self.myGame.blocksControllerH.splice(self.myGame.blocksControllerH.length-1, 1);
                  self.myGame.countOfBlocks.minus();
                  self.myGame.countOfRemovesBlock.plus();  //промах
                  self.background.changeHeart(self.myGame.countOfRemovesBlock.value());  //промах - перекрашиваем сердце
                  self.myView.delete();
                  self.model = null;
                  self.view = null;
                  self.control = null;
                  if (self.myGame.countOfRemovesBlock.value() == 3){
                    self.myGame.soundStop(self.myGame.backgroundSound);
                    setTimeout(self.myGame.soundPlay, 300, self.myGame.overSound);
                    startFlag = true;
                    nextLevelFlag = true;
                    numberOfLevel = 1;
                    document.querySelector('.game-over').style.display = "block";
                    document.querySelector('.new-game-bottom').style.display = "block";
                    storeInfo(self);
                    return;
            }
            else {
                  self.createNewBlock();
            }

          }
      }
          else if (self.flagForBingo == true){            //висячий блок
                  self.posX =self.myCable.posX2;
                  self.posY =self.myCable.posY2;
                  self.rotate = self.myGame.hangingBlockAngle;  // угол поворота висящего элемента и перевод из радиан в градусы
                  self.rotatePosX = self.posX;
                  self.rotatePosY = self.posY;
                  self.myView.update();
          }

          if (!self.flagForBingo){                                                   //заносим кооординаты в переменные объекта каждого элемента
            self.posY = parseInt(self.myView.block.getAttribute("y"));
            self.posX = parseInt(self.myView.block.getAttribute("x"));
              // console.log(self.posY);
          }

          if (self.class == 'down' && self.posY > (self.fieldHeight + 1.1*self.height)){     // если блок попал, но ушел из экрана, удаляем его
// console.log("why");
                  self.myView.delete();
                  self.model = null;
                  self.view = null;
                  self.control = null;
            }
          }

        modelBlock.prototype.blockDown = function() {
          let self = this;
                 self.class = "down";
                 self.rotate = 0;
            }

        modelBlock.prototype.createNewBlock = function() {
          let self = this;
                 game.addBlock();
           }


    //     function modelBlock() {
    //              let self = this;
    //              generalData.call(self);
    //              // self.myView = null;
    //              // self.myField = null;
    //              // self.myCable = null;
    //              // self.myController = null;
    //     }
    //
    // modelBlock.prototype = Object.create(generalData.prototype);
    // modelBlock.prototype.constructor = modelBlock;