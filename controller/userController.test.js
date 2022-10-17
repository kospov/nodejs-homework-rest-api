const { connect } = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { MONGO_URL, PORT } = process.env;
const port = Number(PORT);

const app = require("../app");

const { User } = require("../models");

const request = require("supertest");

describe("test auth routes", () => {
  let server;
  beforeAll(() => (server = app.listen(port)));
  afterAll(() => server.close());

  beforeEach((done) => {
    connect(MONGO_URL, { dbName: "db-contacts" })
      .then(() => done())
      .catch((error) => {
        console.error(error.message);
        process.exit(1);
      });
  });

  test("test login route", async () => {
    const password = "Qwerty1234.";
    const email = "q1234@gmail.com";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = {
      email,
      password: hash,
    };

    const user = await User.create(newUser);

    const loginUser = {
      email,
      password,
    };

    const response = await request(app)
      .patch("/api/users/login")
      .send(loginUser);

    console.log(`status code is ${response.statusCode}`);
    expect(response.statusCode).toEqual(200);

    const { body } = response;
    console.log(`token is ${body.token}`);
    const { token } = await User.findById(user._id);
    expect(body.token).toBe(token);

    console.log(`user object is ${JSON.stringify(body.user)}`);
    expect(body.user.email).toMatch("");
    expect(body.user.subscription).toMatch("");
  });
});
