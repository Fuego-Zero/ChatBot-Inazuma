const const_proxy = require("../util/const-proxy");
const {ChatBot} = require("./bot/chatbot");

const CONFIG = {
	name: "電",
	gender: "girl",
	owner: {
		name: "MomoCow",
		yobikata: [{name: "牛牛", weight: 1}, {name: "司令官", weight: 5}]
	}
};

class Inazuma extends ChatBot{
	constructor(){
		super(CONFIG);
	}
}

module.exports = new Proxy(new Chatbot(), const_proxy);
