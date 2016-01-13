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
    _centerX: 0,
    _centerY: 0,
    
    enter: function() {
        var level = [];
        
        var levelWidth = 500;
        var levelHeight = 500;
        
        for(var x = 0; x < levelWidth; x++) {
            level.push([]);
            for (var y = 0; y < levelHeight; y++) {
                level[x].push(Game.Cell.nullCell);
            }
        }
        
        var generator = new ROT.Map.Cellular(levelWidth, levelHeight);
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
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        
        var topLeftX = Math.max(0, this._centerX - (screenWidth / 2));
        topLeftX = Math.min(topLeftX, this._level.getWidth() - screenWidth);
        
        var topLeftY = Math.max(0, this._centerY - (screenHeight / 2));
        topLeftY = Math.min(topLeftY, this._level.getHeight() - screenHeight);
        
        for (var x = topLeftX; x < topLeftX + screenWidth; x++)
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                var cell = this._level.getCell(x, y);
                display.draw(x - topLeftX, y - topLeftY, cell.getChar(), cell._diffuse);
            }
        
         display.draw(
            this._centerX - topLeftX, 
            this._centerY - topLeftY,
            '@',
            'white',
            'black');
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
            
            // Movement
            if (inputData.keyCode === ROT.VK_A) {
                this.move(-1, 0);
            } else if (inputData.keyCode === ROT.VK_D) {
                this.move(1, 0);
            } else if (inputData.keyCode === ROT.VK_W) {
                this.move(0, -1);
            } else if (inputData.keyCode === ROT.VK_S) {
                this.move(0, 1);
            }
        }    
    },
    move: function(dX, dY) {
        this._centerX = Math.max(0, Math.min(this._level.getWidth() - 1, this._centerX + dX));
        this._centerY = Math.max(0, Math.min(this._level.getHeight() - 1, this._centerY + dY));
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
