const request = require("supertest");
const jwt = require("jsonwebtoken");
const database = require("../database");
const app = require("../app");

beforeEach(() => {
  jest.clearAllMocks();
});

// generating a valid token for a given user ID
const makeToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

const validTransaction = {
  type: "expense",
  category: "Food",
  spendingType: "Non-Discretionary",
  amount: 50,
  date: "01/01/2026",
  description: "Groceries"
};

// ---------------------- ADD TRANSACTION ----------------------
describe("POST /api/add", () => {
  test("adds a transaction successfully", async () => {
    database.execute.mockResolvedValueOnce({ lastInsertRowid: 1 });

    const res = await request(app)
      .post("/api/add")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send(validTransaction);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Transaction added successfully");
    expect(res.body.transactionId).toBe(1);
  });

  test("returns 401 without auth token", async () => {
    const res = await request(app)
      .post("/api/add")
      .send(validTransaction);

    expect(res.status).toBe(401);
  });

  test("returns 401 with invalid token", async () => {
    const res = await request(app)
      .post("/api/add")
      .set("Authorization", "Bearer invalidtoken")
      .send(validTransaction);

    expect(res.status).toBe(401);
  });

  test("returns 400 when fields are missing", async () => {
    const res = await request(app)
      .post("/api/add")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send({ type: "expense" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Issues with data");
  });
});

// ---------------------- EDIT TRANSACTION ----------------------
describe("PUT /api/transactions/:id", () => {
  test("edits a transaction successfully", async () => {
    database.execute.mockResolvedValueOnce({ rowsAffected: 1 });

    const res = await request(app)
      .put("/api/transactions/1")
      .set("Authorization", `Bearer ${makeToken(1)}`)
      .send(validTransaction);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("returns 404 when transaction does not belong to user", async () => {
    database.execute.mockResolvedValueOnce({ rowsAffected: 0 });

    const res = await request(app)
      .put("/api/transactions/99")
      .set("Authorization", `Bearer ${makeToken(2)}`)
      .send(validTransaction);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Transaction not found");
  });

  test("returns 401 without auth token", async () => {
    const res = await request(app)
      .put("/api/transactions/1")
      .send(validTransaction);

    expect(res.status).toBe(401);
  });
});

// ---------------------- DELETE TRANSACTION ----------------------
describe("DELETE /api/transactions/:id", () => {
  test("deletes a transaction successfully", async () => {
    database.execute.mockResolvedValueOnce({ rowsAffected: 1 });

    const res = await request(app)
      .delete("/api/transactions/1")
      .set("Authorization", `Bearer ${makeToken(1)}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });

  test("returns 404 when transaction does not belong to user", async () => {
    database.execute.mockResolvedValueOnce({ rowsAffected: 0 });

    const res = await request(app)
      .delete("/api/transactions/99")
      .set("Authorization", `Bearer ${makeToken(2)}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Not found");
  });

  test("returns 401 without auth token", async () => {
    const res = await request(app)
      .delete("/api/transactions/1");

    expect(res.status).toBe(401);
  });
});