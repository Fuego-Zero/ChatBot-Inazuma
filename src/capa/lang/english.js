const VOWELS = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];

function getSingular(word){
  return (typeof word !== "string")? "": (VOWELS.indexOf(word.substr(0, 1)) >= 0)? `an ${word}`: `a ${word}`;
}

module.exports = {
  getSingular
};
