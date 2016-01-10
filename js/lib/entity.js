String.format.map.a = "describeA";
String.format.map.the = "describeThe";
String.format.map.verb = "describeVerb";
String.format.map.he = "describeHe";
String.format.map.him = "describeHim";

/**
 * @class Anything with a place and a visual representation
 */
Game.Entity = function(properties) {
    properties = properties || {};
    
	this._type = properties['type'];
	this._id = null;
	this._char = properties['char'] || "";
	this._name = properties['name'] || "";
	this._countable = properties['countable'] || true;
	this._diffuse =  properties['color'] || [120, 120, 120]; /* base color */
	this._light = null; /* emitting light? */
    
    this._attachedMixins = {};
    var mixins = properties['mixins'] || [];
    for (var i = 0;  i < mixins.length; i++) {
        // Copy over all properties from each mixin as long
        // as it's not the name or the init property. We
        // also make sure not to override a property that
        // already exists on the entity.
        for (var key in mixins[i]) {
            if (key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
                this[key] = mixins[i][key];
            }
        }
        // Add the name of this mixin to our attached mixins
        this._attachedMixins[mixins[i].name] = true;
        // Finally call the init function if there is one
        if (mixins[i].init) {
            mixins[i].init.call(this, properties);
        }
    }
    
	this._color = ""; /* computed */
    
	this._level = null;
	this._position = null;
}

Game.Entity.prototype.fromTemplate = function(template) {
	if ("id" in template) { this._id = template.id; }
	if ("name" in template) { this._name = template.name; }
	if ("light" in template) { this._light = template.light; }
	if ("countable" in template) { this._countable = template.countable; }
	if ("char" in template) { 
		if (template["char"] instanceof Array) {
			this._char = template["char"].random();
		} else {
			this._char = template["char"];
		}
	}
	
	if ("color" in template) {
		if ("colorVariation" in template) {
			this._diffuse = ROT.Color.randomize(template.color, template.colorVariation);
		} else {
			this._diffuse = template.color;
		}
	}
	if ("colors" in template) { this._diffuse = template.colors.random(); }
	
	return this;
}

Game.Entity.prototype.hasMixin = function(obj) {
    // Allow passing the mixin itself or the name as a string
    if (typeof obj === 'object') {
        return this._attachedMixins[obj.name];
    } else {
        return this._attachedMixins[name];
    }
}

Game.Entity.prototype.setId = function(id) {
	this._id = id;
	return this;
}

Game.Entity.prototype.getId = function() {
	return this._id;
}

Game.Entity.prototype.computeColor = function(ambientLight, diffuseLight) {
	var totalLight = ambientLight;
	if (diffuseLight) { totalLight = ROT.Color.add(totalLight, diffuseLight); }
	this._color = ROT.Color.multiply(this._diffuse, totalLight);
	return this;
}

Game.Entity.prototype.getChar = function() {
	return this._char;
}

Game.Entity.prototype.getColor = function() {
	return this._color;
}

Game.Entity.prototype.getType = function() {
	return this._type;
}

Game.Entity.prototype.setPosition = function(x, y, level) {
	if (this._light && this._position) {
		this._level.removeLight(this._position[0], this._position[1], this._light);
	}

	this._level = level;
	this._position = (x === null ? null : [x, y]);
	
	if (this._light && x !== null) {
		this._level.addLight(this._position[0], this._position[1], this._light);
	}

	return this;
}

Game.Entity.prototype.getPosition = function() {
	return this._position;
}

Game.Entity.prototype.getLevel = function() {
	return this._level;
}

Game.Entity.prototype.describeA = function() {
	if (!this._countable) { return this.describe(); }
	var first = this._name.charAt(0);
	if (first.match(/[aeiouy]/i)) {
		return "an " + this.describe();
	} else {
		return "a " + this.describe();
	}
}

Game.Entity.prototype.describeThe = function() {
	return "the " + this.describe();
}

Game.Entity.prototype.describe = function() {
	return this._name;
}

Game.Entity.prototype.toString = function() {
	return this.describe();
}

Game.Entity.prototype.setLight = function(light) {
	if (!this._level) { 
		this._light = light;
		return this;
	}
	
	if (this._light) { this._level.removeLight(this._position[0], this._position[1], this._light); }
	this._light = light;
	if (this._light) { this._level.addLight(this._position[0], this._position[1], this._light); }
	
	return this;
}

