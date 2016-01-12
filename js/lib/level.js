Game.Level = function(cells) {
    this._cells = cells;
    this._width = cells.length;
    this._height = cells[0].length;
}

Game.Level.prototype.getWidth = function() {
    return this._width;
}

Game.Level.prototype.getHeight = function() {
    return this._height;
}

Game.Level.prototype.getCell = function(x, y) {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        return Game.Cell.nullCell;
    } else {
        return this._cells[x][y] || Game.Cell.nullCell;
    }
};