'use strict';
  function modelCable() {
    let self = this;
    if (document.documentElement.clientWidth> 750){
      self.fieldWidth = 700;}                                                    //ширина поля
    else{
      self.fieldWidth = document.documentElement.clientWidth-20;
    }
    self.posY1 = -70;                              //начальная позиция блока по Y
    self.posX1 = self.fieldWidth/2;
    self.posY2 = 60;
    self.posX2 = self.fieldWidth/2;
    let angleOne = 0.01/180*Math.PI;
    self.kOfCable = 0.04;                           //коэф частоты качания блока

    let myView = null;
    self.start = function(view) {
      myView = view;
    }

    self.cablePosition = function(){
      myView.update();
      angleOne +=self.kOfCable;                        //скорость врещения
      self.posX2 =self.fieldWidth/2 + 100*Math.sin(angleOne);
      self.posY2 =70 + (-1)*30*Math.cos(angleOne);
    }
  }