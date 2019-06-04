const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/shuls/";
const User = require("../../src/db/models").User;
const Shul = require("../../src/db/models").Shul;
const Room = require("../../src/db/models").Room;
const Rating = require("../../src/db/models").Rating;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : shuls", () => {

  beforeEach((done) => {
    this.shul;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "user@example.com",
        password: "1234567890"
      })
      .then((user) => {
        this.user = user;

        Shul.create({
          userId: this.user.id,
          cityId: 1,
          name: "Example Shul 1",
          nussach: "Ashkenaz",
          childcare: 1,
          femaleLeadership: 3,
          kaddishGeneral: 2,
          kaddishAlone: 4
        })
        .then((shul) => {
          this.shul = shul;

          done();
        });
      });
    });
  });

  describe("member user performing CRUD actions for Shul", () => {
    beforeEach((done) => {
      User.create({
        email: "member@example.com",
        password: "1234567890",
        role: 0
      })
      .then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email
          }
        },
          (err, res, body) => {
            done();
          }
        );
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    });

    describe("GET /shuls/new/select_city", () => {
      it("should render a select city form", (done) => {
        request.get(`${base}new/select_city`, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Add a Shul");
          expect(body).toContain("Region");
          done();
        });
      });
    });

    // describe("GET /shuls/new/shul_details", () => {
    //   const options = {
    //     url: `${base}new/select_city`,
    //     form: {
    //       country: "USA",
    //       stateRegion: "NJ",
    //       city: "1",
    //     }
    //   };
    //
    //   it("should redirect and pass the chosen location to the next page", (done) => {
    //
    //     request.get(`${base}new/shul_details?city=1`, (err, res, body) => {
    //       expect(res.statusCode).toBe(200);
    //       expect(err).toBeNull();
    //       expect(body).toContain("Add a Shul");
    //       expect(body).toContain("Bergenfield");
    //       done();
    //     });
    //   });
    // });
    describe("POST /shuls/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          cityId: 1,
          name: "Example Shul 2",
          nussach: "Ashkenaz",
          childcare: 1,
          femaleLeadership: 3,
          kaddishGeneral: 2,
          kaddishAlone: 4
        }
      };

      it("should create a new shul and redirect", (done) => {
        request.post(options, (err, res, body) => {
          Shul.findOne({where: {name: "Example Shul 1"}})
          .then((shul) => {
            expect(res.statusCode).toBe(303);
            expect(shul.name).toBe("Example Shul 1");
            expect(shul.childcare).toBe(1);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      it("should not create a new shul that fails validation", (done) => {
        const options = {
          url: `${base}create`,
          form: {
            cityId: 1,
            name: "a",
            nussach: "b",
            childcare: 1,
            femaleLeadership: 3,
            kaddishGeneral: 2,
            kaddishAlone: 4
          }
        };

        request.post(options, (err, res, body) => {
          Shul.findOne({where: {name: "a"}})
          .then((shul) => {
            expect(shul).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /shuls", () => {
      it("should return a status code of 200 and all shuls", (done) => {
        request.get(base, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Shuls");
          expect(body).toContain("Example Shul 1");
          done();
        });
      });
    });
  });
});
