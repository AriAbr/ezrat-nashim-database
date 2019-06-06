const userQueries = require("../db/queries.users.js");
const shulQueries = require("../db/queries.shuls.js");
const roomQueries = require("../db/queries.rooms.js");
const passport = require("passport");
const Authorizer = require("../policies/shul");


module.exports = {
  newSelectCity(req, res, next){
    const authorized = new Authorizer(req.user).new();

    if(authorized) {
      res.render("shuls/new/select_city");
    } else {
      //attach header to response - current url
      //better to get path from req
      // res.writeHead(200, {'redirectUrl': 'shuls/new/select_city'});
      // res.cookie("redirectUrl", "shuls/new/select_city");
      // res.setHeader("redirectUrl", "shuls/new/select_city");
      req.flash("notice", "You must sign in to add a shul.");
      res.redirect(302, `/users/sign_in`);
    }
  },

  newShulForm(req, res, next){
    const authorized = new Authorizer(req.user).new();

    if(authorized && req.headers.referer && (req.headers.referer.includes("select_city") || req.headers.referer.includes("shul_details"))) {
      let cityId = parseInt(req._parsedUrl.query.slice(5));
      res.render("shuls/new/shul_details", {cityId});
    } else if (!authorized){
      req.flash("notice", "You must sign in to add a shul.");
      res.redirect(`/`);
    } else {
      req.flash("notice", "Please select a city before entering your shul's information.");
      res.redirect(`select_city`);
    }
  },

  create(req, res, next){
    const authorized = new Authorizer(req.user).create();

    if(authorized){
      let newShul = {
        cityId: req.body.cityId,
        name: req.body.name,
        nussach: req.body.nussach,
        childcare: req.body.childcare,
        femaleLeadership: req.body.femaleLeadership,
        kaddishGeneral: req.body.kaddishGeneral,
        kaddishAlone: req.body.kaddishAlone
      }

      const shulKeys = Object.keys(req.body);

      //parse out rooms
      let rooms = {};

      //for each key in req.body
      for (let i = 0; i < shulKeys.length; i++){

        //if the key has an underscore
        if(shulKeys[i].includes("_")){
          //define currShulKey, currShulNumber and split the key
          let currShulKey = "";
          let currShulNumber = ""
          let underscoreFound = false;
          for (let j = 0; j < shulKeys[i].length; j++){
            let currChar = shulKeys[i][j];

            if(currChar === "_") {
              underscoreFound = true;
              continue;
            } else if (!underscoreFound) {
              //add currChar to currShulKey
              currShulKey = currShulKey.concat(currChar);
            } else if (underscoreFound) {
              //add currChar to currShulNumber
              currShulNumber = currShulNumber.concat(currChar);
            }
          }

          //add key/value to rooms object
          if(!rooms[currShulNumber]){
            rooms[currShulNumber] = {}
          }
          let originalShulKey = String(shulKeys[i]);
          rooms[currShulNumber][currShulKey] = req.body[originalShulKey];
        }
      }

      shulQueries.addShul(newShul, (err, shul) => {
        if (err) {
          res.redirect(500, "new/select_city");
        } else {
          //add rooms
          for (let i = 0; i < Object.keys(rooms).length; i++) {
            let currRoom = rooms[Object.keys(rooms)[i]];
            currRoom.shulId = String(shul.id);
            roomQueries.addRoom(currRoom, (err, room) => {
              if(err){
                res.redirect(500, "new/select_city");
              } else {

              }
            })
          }
          res.redirect(303, "/");
        }
      });
    } else {
      req.flash("notice", "You must sign in to submit a shul.");
      res.redirect("/");
    }
  },

  index(req, res, next){
    shulQueries.getAllShuls((err, shuls) => {
      if(err){
        console.log(err);
        res.redirect(500, "/");
      } else {
        res.render("shuls/index", {shuls});
      }
    })
  },

}
