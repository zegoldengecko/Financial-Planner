const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database = require("../database");

const app = require("../app");

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------- REGISTRATION ----------------------
describe("POST /api/register", () => {
  test("registers a new user successfully", async () => {
    database.execute.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).post("/api/register").send({
      email: "test@test.com",
      username: "testuser",
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("returns 400 when fields are missing", async () => {
    const res = await request(app).post("/api/register").send({
      email: "test@test.com"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  test("returns 400 when user already exists", async () => {
    database.execute.mockRejectedValueOnce(new Error("UNIQUE constraint failed"));

    const res = await request(app).post("/api/register").send({
      email: "test@test.com",
      username: "testuser",
      password: "password123"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
});

// ---------------------- LOGIN ----------------------
describe("POST /api/login", () => {
  test("logs in successfully and returns JWT", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    database.execute.mockResolvedValueOnce({
      rows: [{ id: 1, username: "testuser", email: "test@test.com", password: hashedPassword }]
    });

    const res = await request(app).post("/api/login").send({
      username: "testuser",
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.message).toBe("Login successful");

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe(1);
  });

  test("returns 401 for unknown user", async () => {
    database.execute.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).post("/api/login").send({
      username: "nobody",
      password: "password123"
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid username or password");
  });

  test("returns 401 for wrong password", async () => {
    const hashedPassword = await bcrypt.hash("correctpassword", 10);

    database.execute.mockResolvedValueOnce({
      rows: [{ id: 1, username: "testuser", email: "test@test.com", password: hashedPassword }]
    });

    const res = await request(app).post("/api/login").send({
      username: "testuser",
      password: "wrongpassword"
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid username or password");
  });

  test("returns 400 when fields are missing", async () => {
    const res = await request(app).post("/api/login").send({
      username: "testuser"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Username and password required");
  });
});