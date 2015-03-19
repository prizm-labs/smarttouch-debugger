// Write your package code here!

startGame = function(){
    if (screenfull.enabled) {
        screenfull.request();
    }

    $('#gameLauncher').hide();

    GameWorld.loadBatch('assets/json/card-manifest.json',function(){
      GameWorld.render($('#gameView').get(0));

      var manifest = ["c2","c3","c4","c5","c1"];
      GameWorld.generateCards(manifest);
    },false);

    
  }