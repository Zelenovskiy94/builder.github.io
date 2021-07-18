'use strict';
function viewBackground() {
    let self = this;
    self.posYBackground = null;  //начальная позиция фона
    self.posYconstructionField = null;  //начальная позиция фона
    const NSStandart = "http://www.w3.org/2000/svg";
    let myField = null;
    let myGame = null;
    self.startingPointDownBackground = 0;                         //точка от которой опускается фон
    self.distanceVertical = null;                                     //на сколько опустить


    self.start = function(field, game) {
      myField = field;
      myGame = game;
      let SVGFieldW = parseInt(window.getComputedStyle(myField).width);
      let SVGFieldH = parseInt(window.getComputedStyle(myField).height);
      self.posYconstructionField = SVGFieldH - 590;
      self.posYBackground = SVGFieldH - 4900;
      self.background = document.createElementNS(NSStandart, 'image');
      self.background.setAttribute('x', '0');
      self.background.setAttribute('y', self.posYBackground);
      self.background.setAttribute('height', 5000);
      if (SVGFieldW > 450){
        self.background.setAttribute('width', 700 );
        self.background.setAttributeNS("http://www.w3.org/1999/xlink","href","img/back.jpg");
      } else {
        self.background.setAttribute('width', 450 );
        self.background.setAttributeNS("http://www.w3.org/1999/xlink","href","img/back-mobile.jpg");
      }
      myField.appendChild(self.background);

      self.constructionField = document.createElementNS(NSStandart, 'image');
      self.constructionField.setAttribute('x', '0');
      self.constructionField.setAttribute('y', self.posYconstructionField);
      self.constructionField.setAttribute('width', SVGFieldW );
      self.constructionField.setAttribute('height', 595);
      if (SVGFieldW > 450){
        self.constructionField.setAttribute('width', 700 );
        self.constructionField.setAttributeNS("http://www.w3.org/1999/xlink","href","img/constructionField.png");
      } else {
          self.constructionField.setAttribute('width', 450 );
          self.constructionField.setAttributeNS("http://www.w3.org/1999/xlink","href","img/constructionField-mobile.png");
      }
      myField.appendChild(self.constructionField);

      let posOfHeart = parseInt(window.getComputedStyle(myField).width)-100;           //получаем ширину svg поля
      for (let i = 0; i<3; i++){
        self.lives = document.createElementNS(NSStandart, 'image');
        self.lives.setAttribute('x', posOfHeart);
        self.lives.setAttribute('y', 20);
        self.lives.setAttribute('width', 24);
        self.lives.setAttribute('height', 20);
        self.lives.setAttribute('id', 'heart'+(i+1));
        self.lives.setAttributeNS("http://www.w3.org/1999/xlink","href","img/heartred.png");
        myField.appendChild(self.lives);
        posOfHeart += 24;
      }

      self.houseSign = document.createElementNS(NSStandart, 'image');
      self.houseSign.setAttribute('x', 20);
      self.houseSign.setAttribute('y', 20);
      self.houseSign.setAttribute('width', 50);
      self.houseSign.setAttribute('height', 60);
      self.houseSign.setAttributeNS("http://www.w3.org/1999/xlink","href","img/houseSign.png");
      myField.appendChild(self.houseSign);

      self.points = document.createElementNS(NSStandart, 'text');
      self.points.setAttribute('x', 45);
      self.points.setAttribute('y', 70);
      self.points.setAttribute('font-size', 40);
      self.points.setAttribute('stroke', 'black');
      self.points.setAttribute('fill', '#f6ee09');
      self.points.setAttribute('font-family', 'Arciform Sans cyr-lat');
      self.points.textContent = 0;
      myField.appendChild(self.points);
   }

   self.backgroundDownStart = function(h) {                                 //аргумент - высота блока
      self.startingPointDownBackground+=1.6;                          //увеличение стартовой точки на 1.6px
      let y = parseFloat(self.background.getAttribute("y"));
      self.background.setAttribute('y', y+.8);                    //увеличение Y на 1.6px;
      let yw = parseFloat(self.constructionField.getAttribute('y'));
      self.constructionField.setAttribute('y', yw+1.2);
      if( self.startingPointDownBackground >= h){
         myGame.signToDownBack = false;
         self.startingPointDownBackground = 0;
      }
    }

   self.changeHeart = function(id) {                  //перекрашивание сердца
     let changeColorOfHeard = document.getElementById('heart'+id);
     changeColorOfHeard.setAttributeNS("http://www.w3.org/1999/xlink","href","img/heartgrey.png");
   }

   self.pointsPlus = function(point) {                  //выводит количество очков
     self.points.textContent = point;
   }
}