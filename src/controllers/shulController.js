const userQueries = require("../db/queries.users.js");
const shulQueries = require("../db/queries.shuls.js");
const passport = require("passport");
const Authorizer = require("../policies/shul");


module.exports = {
  newSelectCity(req, res, next){
    const authorized = new Authorizer(req.user).new();

    if(authorized) {
      res.render("shuls/new/select_city");
    } else {
      req.flash("notice", "You must sign in to submit a shul.");
      res.redirect(`/`);
    }
  },

  newShulForm(req, res, next){
    const authorized = new Authorizer(req.user).new();

    if(authorized) {
      let cityId = parseInt(req._parsedUrl.query.slice(5));
      res.render("shuls/new/shul_details", {cityId});
    } else {
      req.flash("notice", "You must sign in to submit a shul.");
      res.redirect(`/`);
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

      shulQueries.addShul(newShul, (err, shul) => {
        if (err) {
          res.redirect(500, "new/select_city");
        } else {
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
