const express = require("express");
const request = require("supertest");
const { startMongoServer, closeMongoServer } = require("./mongoConfigTesting");
const indexRouter = require("../routes/index");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);

beforeAll(async () => {
  await startMongoServer();
});

afterAll(async () => {
  await closeMongoServer();
});

describe("Index Test", () => {
  it("returns welcome message", (done) => {
    request(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect({ message: "Hello! This is Nogiback's Where's Waldo API" }, done);
  });
});

describe("Level Tests", () => {
  it("adds an level to the database", async () => {
    const response = await request(app)
      .post("/levels")
      .type("form")
      .send({
        name: "Ski Hill",
        characters: [
          {
            character: "Waldo",
            locationX: 750,
            locationY: 450,
          },
          {
            character: "Wenda",
            locationX: 840,
            locationY: 432,
          },
          {
            character: "Odlaw",
            locationX: 278,
            locationY: 222,
          },
          {
            character: "Wizard",
            locationX: 923,
            locationY: 420,
          },
        ],
        dimensions: {
          width: 1200,
          height: 900,
        },
      });
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.newLevel).toBeDefined();
  });

  // it("returns error if no levels found", async () => {
  //   const res = await request(app).get("/levels");
  //   expect(res.headers["content-type"]).toMatch(/json/);
  //   expect(res.status).toMatch(404);
  //   expect(res.body.message).toMatch("Error: No levels found.");
  // });
});
