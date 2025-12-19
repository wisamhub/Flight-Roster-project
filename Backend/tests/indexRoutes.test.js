import request from "supertest";
import { describe, test, expect, beforeAll } from "vitest";

let app;

describe("Express routes", () => {
  beforeAll(async () => {
    const module = await import("../index.js");
    app = module.default;
  });

  test("GET /guest returns 200", async () => {
    const res = await request(app).get("/guest");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Track Your Flight");
  });

  test("GET / returns 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Continue as Passenger");
  });

  test("GET /about-us returns 200", async () => {
    const res = await request(app).get("/about-us");
    expect(res.status).toBe(200);
    expect(res.text).toContain("About Us");
  });

  test("GET /login returns 200", async () => {
    const res = await request(app).get("/login");
    expect(res.status).toBe(200);
  });
});