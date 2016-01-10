Game.Cell = function(properties) {
    properties = properties || {};
	Game.Entity.call(this, properties);
	
	this._blocksLight = properties['blocksLight'] || false;
	this._blocksMovement = properties['blocksMovement'] || false;
    this._isDiggable = properties['isDiggable'] || false;
	this._totalLight = null; /* computed light */
	this._portal = null;
}
Game.Cell.extend(Game.Entity);

Game.Cell.prototype.fromTemplate = function(template) {
	Game.Entity.prototype.fromTemplate.call(this, template);
	if ("blocksLight" in template) { this._blocksLight = template.blocksLight; }
	if ("blocksMovement" in template) { this._blocksMovement = template.blocksMovement; }
    if ("isDiggable" in template) { this._isDiggable = template.isDiggable; }
	return this;
}

/**
 * Total amount of light at this cell
 */
Game.Cell.prototype.getTotalLight = function() {
	return this._totalLight;
}

Game.Cell.prototype.setTotalLight = function(light) {
	this._totalLight = light;
	return this;
}

Game.Cell.prototype.bumpInto = function(being) {
	if (being == Game.player) { Game.status.show("%A blocks the way.", this); }
}

Game.Cell.prototype.blocksLight = function() {
	return this._blocksLight;
}

Game.Cell.prototype.blocksMovement = function() {
	return this._blocksMovement;
}