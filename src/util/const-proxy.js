class IllegalModifyError extends Error{
  constructor(msg){
    super(msg);
    this.name = "IllegalModifyError";
  }
}

module.exports = {
	set(target, property, value, receiver){
		if(property === property.toUpperCase()){
			throw new IllegalModifyError(`Property '${property}' is not modifiable.`);
		}
		target[property] = value;
    return true;
	},
  deleteProperty(target, property){
    if(property === property.toUpperCase()){
			throw new IllegalModifyError(`Property '${property}' is not deletable.`);
		}
    return delete target[property];
  }
};
