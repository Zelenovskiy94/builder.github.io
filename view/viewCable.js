'use strict';
function viewCable() {
    let self = this;

    const NSStandart = "http://www.w3.org/2000/svg";
    let myModel = null;
    let myField = null;
    let myGame = null;

    self.start = function(model, field, game) {
      myModel = model;
      myField = field;
      myGame = game;
      self.cable = document.createElementNS(NSStandart,'line')
      self.cable.setAttribute('stroke', 'black');
      self.cable.setAttribute('stroke-width', 3);     //толщина троса
      self.cable.setAttribute('stroke', "#343433");
      myField.appendChild(self.cable);

      self.hook = document.createElementNS(NSStandart, 'image');
      self.hook.setAttributeNS("http://www.w3.org/1999/xlink","href","img/hook.png");
      self.hook.setAttribute('width', 20);
      self.hook.setAttribute('height', 40);
      myField.appendChild(self.hook);
   }

    self.update = function(){
      self.cable.setAttribute('x1', myModel.posX1);
      self.cable.setAttribute('y1', myModel.posY1);
      self.cable.setAttribute('x2', myModel.posX2);
      self.cable.setAttribute('y2', myModel.posY2);
      self.hook.setAttribute('x', myModel.posX2-10);
      self.hook.setAttribute('y', myModel.posY2-3);
      self.hook.setAttribute('transform', "rotate("+myGame.hangingBlockAngle+","+myModel.posX2+","+myModel.posY2+")");
   }
}