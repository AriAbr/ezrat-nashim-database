const Shul = require("./models").Shul;
const Room = require("./models").Room;
const Authorizer = require("../policies/shul");

module.exports = {

  addShul(newShul, callback){
    return Shul.create({
      cityId: newShul.cityId,
      name: newShul.name,
      nussach: newShul.nussach,
      childcare: newShul.childcare,
      femaleLeadership: newShul.femaleLeadership,
      kaddishGeneral: newShul.kaddishGeneral,
      kaddishAlone: newShul.kaddishAlone
    })
    .then((shul) => {
      callback(null, shul);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getAllShuls(callback){
    return Shul.all({
      include: [
        {model: Room, as: "rooms"}
      ]
    })
    .then((shuls) => {
      callback(null, shuls);
    })
    .catch((err) => {
      callback(err);
    })
  },

}
