const sequelize = require("../../src/db/models/index").sequelize;
const Shul = require("../../src/db/models").Shul;
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

          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      });
    });
  });

  describe("#create()", () => {
    it("should create a Shul object with valid information", (done) => {
      Shul.create({
        userId: this.user.id,
        cityId: 1,
        name: "Farquaad",
        nussach: "Sephard",
        childcare: 3,
        femaleLeadership: 2,
        kaddishGeneral: 1,
        kaddishAlone: 2
      })
      .then((shul) => {
        expect(shul.name).toBe("Farquaad");
        expect(shul.nussach).toBe("Sephard");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a shul with null inputs", (done) => {
      Shul.create({
        userId: this.user.id,
        cityId: 1,
        name: "null",
        nussach: null,
        childcare: 3,
        femaleLeadership: 2,
        kaddishGeneral: 1,
        kaddishAlone: 2
      })
      .then((shul) => {
        //skiped by validation
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("cannot be null");
        done();
      });
    });
  });
});
