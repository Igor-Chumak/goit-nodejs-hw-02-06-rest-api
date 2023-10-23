import mongoose from "mongoose";
import request from "supertest";

import app from "../../app.js";

import User from "../../models/user.js";

const { TEST_DB_HOST, PORT = 4000 } = process.env;

describe("test signup route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(() => {});

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test signup with correct data", async () => {
    const signupData = {
      email: "chigorv@ukr.net",
      password: "123456",
    };
    const { statusCode, body } = await request(app).post("/users/register").send(signupData);
    expect(statusCode).toBe(201);
    expect(body.user.email).toBe(signupData.email);
    const user = await User.findOne({ email: signupData.email });
    expect(user.email).toBe(signupData.email);
  });
});
