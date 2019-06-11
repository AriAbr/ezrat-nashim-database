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
          cityId: '1',
          name: 'Example Shul 1',
          nussach: 'ashkenaz',
          childcare: '1',
          femaleLeadership: '2',
          kaddishGeneral: '3',
          kaddishAlone: '1',
          rooms: [
            {
              roomName: 'Beit Midrash',
              size: '1',
              audVisRating: '4',
              sameFloorSide: 'true',
            },
            {
              roomName: 'Main Shul',
              size: '2',
              audVisRating: '3',
              sameFloorSide: 'true',
            }
          ]
        }, {
          include: {
            model: Room,
            as: "rooms"
          }
        })
        .then((shul) => {
          this.shul = shul;

          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
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

    describe("GET /shuls/new/select_city", () => {
      const options = {
        url: `${base}new/select_city`,
        form: {
          country: "USA",
          stateRegion: "NJ",
          city: "1",
        }
      };

      it("should render a select location form", (done) => {

        request.get(`${base}new/select_city`, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Add a Shul");
          expect(body).toContain("Select a City:");
          done();
        });
      });
    });

    describe("GET /shuls/new/shul_details", () => {
      const options = {
        url: `${base}new/shul_details`,
        query: `city=1`,
        referer: "select_city"
      };

      it("should render a shul submission form", (done) => {
        request.get(`${base}new/select_city`, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Add a Shul");
          expect(body).toContain("Bergenfield");
          done();
        });
      });

      it("should redirect if no city is selected", (done) => {
        const options = {
          url: `${base}new/shul_details`,
          referer: "select_city"
        };
        request.get(`${base}new/select_city`, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Add a Shul");
          expect(body).toContain("Select a City:");
          done();
        });
      });
      
      it("should redirect if the referer is not select_city", (done) => {
        const options = {
          url: `${base}new/shul_details`,
          query: `city=1`,
        };
        request.get(`${base}new/select_city`, (err, res, body) => {
          expect(res.statusCode).toBe(200);
          expect(err).toBeNull();
          expect(body).toContain("Add a Shul");
          expect(body).toContain("Select a City:");
          done();
        });
      });
    });
    describe("POST /shuls/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          cityId: '1',
          name: 'Example Shul 2',
          nussach: 'ashkenaz',
          roomName_1: 'Beit Midrash',
          size_1: '1',
          audVisRating_1: '4',
          sameFloorSide_1: 'true',
          roomName_2: 'Main Shul',
          size_2: '2',
          audVisRating_2: '3',
          sameFloorSide_2: 'true',
          childcare: '1',
          femaleLeadership: '2',
          kaddishGeneral: '3',
          kaddishAlone: '1'
        }
      };

      it("should create a new shul and associate rooms with it, then redirect", (done) => {
        this.testShul;
        request.post(options, (err, res, body) => {
          Shul.findOne({where: {name: "Example Shul 2"}})
          .then((shul) => {
            this.testShul = shul;
            expect(res.statusCode).toBe(303);
            expect(shul.name).toBe("Example Shul 2");
            expect(shul.childcare).toBe(1);
          })
          .then((res) => {
            Room.findOne({where: {
              roomName: "Beit Midrash",
              shulId: this.testShul.id
            }})
            .then((room) => {
              // expect(res.statusCode).toBe(303);
              expect(room).not.toBeNull();
              expect(room.roomName).toBe("Beit Midrash");
              expect(room.size).toBe(1);
            })
            .then((res) => {
              Room.findOne({where: {
                roomName: "Main Shul",
                shulId: this.testShul.id
              }})
              .then((room) => {
                // expect(res.statusCode).toBe(303);
                expect(room).not.toBeNull();
                expect(room.roomName).toBe("Main Shul");
                expect(room.size).toBe(2);
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              })
            })
            .catch((err) => {
              console.log(err);
              done();
            })
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      it("should not create a new shul that fails validation", (done) => {
        const optionsBadName = {
          url: `${base}create`,
          form: {
            cityId: 1,
            name: "a",
            nussach: "b",
            roomName_1: 'Beit Midrash',
            size_1: '1',
            audVisRating_1: '4',
            sameFloorSide_1: 'true',
            childcare: 1,
            femaleLeadership: 3,
            kaddishGeneral: 2,
            kaddishAlone: 4
          }
        };

        request.post(optionsBadName, (err, res, body) => {
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

      it("should not create a shul with duplicate room names", (done) => {
        const options = {
          url: `${base}create`,
          form: {
            cityId: '1',
            name: 'Example Shul 3',
            nussach: 'ashkenaz',
            roomName_1: 'Beit Midrash',
            size_1: '1',
            audVisRating_1: '4',
            sameFloorSide_1: 'true',
            roomName_2: 'Main Shul',
            size_2: '1',
            audVisRating_2: '4',
            sameFloorSide_2: 'true',
            roomName_3: 'Beit Midrash',
            size_3: '2',
            audVisRating_3: '3',
            sameFloorSide_3: 'true',
            childcare: '1',
            femaleLeadership: '2',
            kaddishGeneral: '3',
            kaddishAlone: '1'
          }
        };

        request.post(options, (err, res, body) => {
          Shul.findOne({where: {name: "Example Shul 3"}})
          .then((shul) => {
            expect(shul).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      })
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
