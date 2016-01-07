Game.Level.MyDungeon = function() {
    Game.Level.call(this);
    
    this._playerLight = [255, 255, 255];
    this._build();
    //this._setup();
}

Game.Level.MyDungeon.extend(Game.Level);

Game.Level.MyDungeon.prototype._build = function() {
    var w = 20, h = 10;
    var generator = new ROT.Map.Arena(w, h);
    var bitMap = [];
	
    for (var i = 0; i < w; i++) { bitMap[i] = []; }
    generator.create(function(x, y, type) {
        bitMap[x][y] = type;
    });
    
    this._buildFromBitMap(bitMap, w, h);
}

Game.Level.MyDungeon.prototype._buildFromBitMap = function(bitMap, w, h) {
	for (var i=0;i<w;i++) {
		for (var j=0;j<h;j++) {
			var value = bitMap[i][j];

			switch (value) {
				case 0:
					var floor = Game.Cells.create("floor");
					this.setCell(floor, i, j);
				break;

				case 1:
				    var wall = Game.Cells.create("stonewall");
					this.setCell(wall, i, j);
				break;
			} /* switch */
		}
	}
    this.cells["10,8"].setId("start");
}

Game.Level.MyDungeon.prototype._getFreeCells = function() {
	var result = [];
	for (var key in this.cells) {
		var cell = this.cells[key];
		if (cell.getType() == "floor" && !this.items[key] && !this.beings[key]) { result.push(cell); }
	}
	return result;
}

Game.Level.MyDungeon.prototype._welcomeBeing = function(being) {
	Game.Level.prototype._welcomeBeing.call(this, being);
	if (being == Game.player) { being.setLight(this._playerLight); }
}