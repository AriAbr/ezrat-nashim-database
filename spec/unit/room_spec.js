const sequelize = require("../../src/db/models/index").sequelize;
const Shul = require("../../src/db/models").Shul;
const Room = require("../../src/db/models").Room;
const User = require("../../src/db/models").User;


describe("Shul", () => {
  beforeEach((done) => {
    this.shul;
    this.room;
    this.user;

    sequelize.sync({force: true}).then(() => {
      User.create({
        email: "hooligan#1@example.com",
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

          Room.create({
            shulId: this.shul.id,
            roomName: "Beit Midrash",
            size: 2,
            avgAudVisRating: 4,
            sameFloorCentered: true,
            sameFloorSide: true,
            sameFloorBack: false,
            elevatedCentered: false,
            elevatedSide: false,
            elevatedBack: false,
            balconySide: false,
            balconyBack:false,
            noWomenSection:false
          })
          .then((room) => {
            this.room = room;
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      });
    });
  });

  describe("#create()", () => {
    it("should create a Room object with a valid name and an assigned shul", (done) => {
      Room.create({
        shulId: this.shul.id,
        roomName: "Main Shul",
        size: 2,
        avgAudVisRating: 4,
        sameFloorCentered: true,
        sameFloorSide: true,
        sameFloorBack: false,
        elevatedCentered: false,
        elevatedSide: false,
        elevatedBack: false,
        balconySide: false,
        balconyBack:false,
        noWomenSection:false
      })
      .then((room) => {
        expect(room.roomName).toBe("Main Shul");
        expect(room.shulId).toBe(this.shul.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a room without an assigned shul", (done) => {
      Room.create({
        roomName: "Main Shul",
        size: 2,
        avgAudVisRating: 4,
        sameFloorCentered: true,
        sameFloorSide: true,
        sameFloorBack: false,
        elevatedCentered: false,
        elevatedSide: false,
        elevatedBack: false,
        balconySide: false,
        balconyBack:false,
        noWomenSection:false
      })
      .then((shul) => {
        //skiped by validation
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Room.shulId cannot be null");
        done();
      });
    });
  });
});
