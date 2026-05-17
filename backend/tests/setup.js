jest.mock("../database", () => ({
  execute: jest.fn()
}));