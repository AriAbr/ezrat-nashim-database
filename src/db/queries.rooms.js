const Shul = require("./models").Shul;
const Room = require("./models").Room;
const Authorizer = require("../policies/shul");

module.exports = {

  addRoom(newRoom, callback){
    return Room.create({
      shulId: parseInt(newRoom.shulId),
      roomName: newRoom.roomName,
      size: parseInt(newRoom.size),
      avgAudVisRating: parseInt(newRoom.audVisRating),
      sameFloorCentered: (newRoom.sameFloorCentered === "true") || false,
      sameFloorSide: (newRoom.sameFloorSide === "true") || false,
      sameFloorBack: (newRoom.sameFloorBack === "true") || false,
      elevatedCentered: (newRoom.elevatedCentered === "true") || false,
      elevatedSide: (newRoom.elevatedSide === "true") || false,
      elevatedBack: (newRoom.elevatedBack === "true") || false,
      balconySide: (newRoom.balconySide === "true") || false,
      balconyBack: (newRoom.balconyBack === "true") || false,
      noWomenSection: (newRoom.noWomenSection === "true") || false
    })
    .then((room) => {
      callback(null, room);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getAllRooms(callback){
    return Room.all()
    .then((rooms) => {
      callback(null, rooms);
    })
    .catch((err) => {
      callback(err);
    })
  },

}
