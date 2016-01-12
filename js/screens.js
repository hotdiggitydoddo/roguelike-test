Game.Screen = {};

Game.Screen.startScreen = {
    enter: function() { console.log('Entered start screen.'); },
    exit: function() { console.log('Exited start screen.'); },
    
    render: function(display) {
        display.drawText(1, 1, "%c{yellow}Javascript Roguelike");
        display.drawText(1, 2, "Press [Enter] to start!");

    },
    
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.playScreen);
            }
        }
    }
},
    
// Define our playing screen
Game.Screen.playScreen = {
    _level: null, 
    
    enter: function() {
        var level = [];
        for(var x = 0; x < 80; x++) {
            level.push([]);
            for (var y = 0; y < 24; y++) {
                level[x].push(Game.Cell.nullCell);
            }
        }
        
        var generator = new ROT.Map.Cellular(80, 24);
        generator.randomize(0.5);
        
        var totalIterations = 3;
        
        for(var i = 0; i < totalIterations - 1; i++) {
            generator.create();
        }
        
        generator.create(function(x, y, v) {
            if (v === 1)
                level[x][y] = Game.Cell.floorTile;
            else
                level[x][y] = Game.Cell.wallTile;
        });
        this._level = new Game.Level(level);
        console.log("Entered play screen."); 
    },
    exit: function() { console.log("Exited play screen."); },
    render: function(display) {
        for (var x = 0; x < this._level.getWidth(); x++)
            for (var y = 0; y < this._level.getHeight(); y++) {
                var cell = this._level.getCell(x, y);
                display.draw(x, y, cell.getChar(), cell._diffuse);
            }
      

    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            // If enter is pressed, go to the win screen
            // If escape is pressed, go to lose screen
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.winScreen);
            } else if (inputData.keyCode === ROT.VK_ESCAPE) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
        }    
    }
}

// Define our winning screen
Game.Screen.winScreen = {
    enter: function() {    console.log("Entered win screen."); },
    exit: function() { console.log("Exited win screen."); },
    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            // Generate random background colors
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var background = ROT.Color.toRGB([r, g, b]);
            display.drawText(2, i + 1, "%b{" + background + "}You win!");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}

// Define our winning screen
Game.Screen.loseScreen = {
    enter: function() {    console.log("Entered lose screen."); },
    exit: function() { console.log("Exited lose screen."); },
    render: function(display) {
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose! :(");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here      
    }
}
