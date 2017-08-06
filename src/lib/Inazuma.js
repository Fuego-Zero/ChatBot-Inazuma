const propProxy = require("./util/property-proxy");

class Inazuma{
	constructor(){
		this.capas = [];
	}

	getCapas(){
		return this.capas;
	}
}

module.exports = new Proxy(new Inazuma(), propProxy);
