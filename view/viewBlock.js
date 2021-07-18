'use strict';
function viewBlock() {
    let self = this;
    self.idLastBlock = 125;
    self.typeOfPicture = Math.round(Math.random());
    self.startingPointDown = 0;                                            //точка отcчета при перемещении вниз
    self.distanceBlockVertical = null;


    self.NSStandart = "http://www.w3.org/2000/svg";
    // let myModel = null;
    // let myField = null;
    // let myGame = null;
    // let myCable = null;
  }

   viewBlock.prototype.start = function(model, field, game, cable) {
     let self = this;
     self.myModel = model;
     self.myField = field;
     self.myGame = game;
     self.myCable = cable;
     self.height = self.myModel.height;

     if (self.myGame.countOfBlocks.value() > 1 && self.myGame.countOfBlocks.value() < self.idLastBlock){
       self.blockWindow = document.createElementNS(self.NSStandart,'rect')
       self.blockWindow.setAttribute('fill', '#878e91');
       self.blockWindow.setAttribute('opacity', 0);
       self.blockWindow.setAttribute('width', 68);
       self.blockWindow.setAttribute('height', 68);
       self.blockWindow.setAttribute('x', self.myCable.posX2+1);
       self.blockWindow.setAttribute('y', self.myCable.posY2+1);
       self.myField.appendChild(self.blockWindow);
   }

     self.block = document.createElementNS(self.NSStandart, 'image');
     if (self.myGame.countOfBlocks.value() == 1){
       self.block.setAttributeNS("http://www.w3.org/1999/xlink","href","img/basementBlock.png");
     }
     else if (self.myGame.countOfBlocks.value() == self.idLastBlock){
       self.block.setAttributeNS("http://www.w3.org/1999/xlink","href","img/topBlock.png");
     }
     else {
       self.block.setAttributeNS("http://www.w3.org/1999/xlink","href","img/middleBlock"+self.typeOfPicture+".png");
     }
     self.block.setAttribute('opacity', 0);
     self.block.setAttribute('x', self.myCable.posX2);
     self.block.setAttribute('y', self.myCable.posY2);
     self.myField.appendChild(self.block);
  }

    viewBlock.prototype.update = function(){
      let self = this;
      self.block.setAttribute('x', self.myModel.posX - self.myModel.width/2);
      self.block.setAttribute('y', self.myModel.posY);
      self.block.setAttribute('transform', "rotate("+self.myModel.rotate+","+self.myModel.rotatePosX+","+self.myModel.rotatePosY+")");
      self.block.setAttribute('width', self.myModel.width);
      self.block.setAttribute('height', self.myModel.height);
      self.block.setAttribute('class', self.myModel.class);
       self.class = self.myModel.class;
       self.pY = self.myModel.posY;
      self.block.setAttribute('opacity', 1);
      if (self.blockWindow){
        self.blockWindow.setAttribute('x', (self.myModel.posX - self.myModel.width/2)+1);
        self.blockWindow.setAttribute('y', self.myModel.posY+1);
        self.blockWindow.setAttribute('transform', "rotate("+self.myModel.rotate+","+self.myModel.rotatePosX+","+self.myModel.rotatePosY+")");
        self.blockWindow.setAttribute('class', self.myModel.class);
        self.blockWindow.setAttribute('opacity', 1);
        // self.blockWindow.setAttribute('fill', '#fdf870');
      }
   }

   viewBlock.prototype.updateId = function() {                                                     //функция прсваивания ID блокам
     let self = this;
     self.block.setAttribute('id', self.myModel.id);
   }

   viewBlock.prototype.lightWindow = function() {                                                      //функция "зажечь окна"
    let self = this;
    let lightWin = function(){
      self.blockWindow.setAttribute('fill', '#fdf870');
    }
    setTimeout(lightWin, 300);
   }

    viewBlock.prototype.x = function() {                                                                 //функция перемещения блоков по горизонтали
      let self = this;
      self.block.setAttribute('x', self.myGame.posX2+self.myModel.posXForBuilding);
      if (self.blockWindow){
      self.blockWindow.setAttribute('x', self.myGame.posX2+self.myModel.posXForBuilding+1);
    }
  }

    viewBlock.prototype.y = function() {
       let self = this;
       self.startingPointDown+=1.6;                          //увеличение стартовой точки на 1.6px
       let y = parseFloat(self.block.getAttribute("y"));
       self.block.setAttribute('y', y+1.6);                    //увеличение Y на 1.6px;
       if (self.blockWindow){
          self.blockWindow.setAttribute('y', y+1.6);
       }
       if( self.startingPointDown>=self.distanceBlockVertical){
          self.distanceBlockVertical = '';
          self.startingPointDown = 0;
       }
     }

    viewBlock.prototype.delete = function() {                                                            //удаляем блок
      let self = this;
      self.block.remove();
      if (self.blockWindow){
      self.blockWindow.remove();
    }
    }

    viewBlock.prototype.snaggedBlock = function() {                                                 //функция вращения блока вокруг своей оси
      let self = this;
      self.block.style.transformOrigin = ''+(self.myModel.currentBlock.getBBox().x+self.myModel.width/2)+'px '+(self.myModel.currentBlock.getBBox().y+self.myModel.height/2)+'px';  //в px кроссбраузерно
      self.block.style.transform='rotate('+self.myModel.r+'deg)';
      if (self.blockWindow){
        self.blockWindow.style.transformOrigin = ''+(self.myModel.currentBlock.getBBox().x+self.myModel.width/2)+'px '+(self.myModel.currentBlock.getBBox().y+self.myModel.height/2)+'px'; //в px кроссбраузерно
        self.blockWindow.style.transform='rotate('+self.myModel.r+'deg)';
    }
    }