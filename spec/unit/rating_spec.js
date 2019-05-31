const sequelize = require("../../src/db/models/index").sequelize;
const Shul = require("../../src/db/models").Shul;
const Room = require("../../src/db/models").Room;
const User = require("../../src/db/models").User;
const Rating = require("../../src/db/models").Rating;

describe("Rating", () => {

  beforeEach((done) => {
    this.user;
    this.shul;
    this.room;
    this.rating;

    sequelize.sync({force: true}).then((res) => {
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
          kaddishAlone: 4,
          rooms: [{
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
          }]
        }, {
          include: {
            model: Room,
            as: "rooms"
          }
        })
        .then((shul) => {
          this.shul = shul;
          this.room = this.shul.rooms[0];
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    });
  });

  describe("#create()", () => {

    it("should create an rating an a room for a user", (done) => {

      Rating.create({
        value: 2,
        roomId: this.room.id,
        userId: this.user.id
      })
      .then((rating) => {
        expect(rating.value).toBe(2);
        expect(rating.userId).toBe(this.user.id);
        expect(rating.roomId).toBe(this.room.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a rating without assigned room or user", (done) => {

      Rating.create({
        value: 1
      })
      .then((rating) => {
        expect(rating).toBeNull();
        //validation error will skip this
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Rating.userId cannot be null");
        expect(err.message).toContain("Rating.roomId cannot be null");
        done();
      });
    });

    it("should not create a rating with a value of anything other than 1, 2, 3, 4 or 5", (done) => {
      Rating.create({
        value: 6,
        roomId: this.room.id,
        userId: this.user.id
      })
      .then((rating) => {
        expect(rating).toBeNull();
        //skipped by validation error
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation isIn on value failed");
        done();
      });
    });

  });

  describe("#setUser()", () => {

    it("should associate a rating and a user together", (done) => {

      Rating.create({
        value: 3,
        roomId: this.room.id,
        userId: this.user.id
      })
      .then((rating) => {
        this.rating = rating;
        expect(rating.userId).toBe(this.user.id);

        User.create({
          email: "bob@example.com",
          password: "password"
        })
        .then((newUser) => {

          this.rating.setUser(newUser)
          .then((rating) => {

            expect(rating.userId).toBe(newUser.id);
            done();
          })
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("#getUser()", () => {

    it("should return the associated user", (done) => {

      Rating.create({
        value: 1,
        userId: this.user.id,
        roomId: this.room.id
      })
      .then((rating) => {
        rating.getUser()
        .then((user) => {
          expect(user.id).toBe(this.user.id);
          done();
        })
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});
