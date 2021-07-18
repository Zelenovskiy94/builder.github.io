'use strict';

function controllerGame() {
   let self = this;
   let myModel = null;
   let myField = null;
   let failed = true;

   self.start = function(model, field) {
     myModel = model;
     myField = field;
    document.addEventListener("keydown", self.downKey);
     myField.addEventListener("click", self.downClick);
  }

  self.downClick = function() {                //падение через клик
    myModel.blockDown();
     // failed = false;
     myField.removeEventListener("click", self.downClick);
    return;
  }

  self.downKey = function(e) {                  //падение через клавишу
    e = e || window.event;
    if (e.keyCode == 32){
    myModel.blockDown();
     // failed = false;
     console.log("ergfrg");
     document.removeEventListener("keydown", self.downKey);
  }
    return;
  }

}