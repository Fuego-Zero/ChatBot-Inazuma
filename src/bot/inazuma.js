const const_proxy = require("../util/const-proxy");
const Chatbot = require("./chatbot");

const CONFIG = {
	name: "電",
	gender: "girl",
	owner: {
		name: "MomoCow",
		yobikata: [{name: "牛牛", weight: 1}, {name: "司令官", weight: 5}]
	}
};

class Inazuma extends Chatbot{
	constructor(){
		super(CONFIG);
	}
}

module.exports = new Proxy(new Inazuma(), const_proxy);
