import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";

let flightExists, createFlight, getAvailableStaffForFlight, flight_db;

describe("Database helper functions (mocked)", () => {
  beforeEach(async () => {
    const module = await import("../Database/connection.js");
    flightExists = module.flightExists;
    createFlight = module.createFlight;
    getAvailableStaffForFlight = module.getAvailableStaffForFlight;
    flight_db = module.default; // the client
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("flightExists returns true when rowCount > 0", async () => {
    flight_db.query = vi.fn().mockResolvedValue({ rowCount: 1 });
    const exists = await flightExists("AN123");
    expect(exists).toBe(true);
    expect(flight_db.query).toHaveBeenCalled();
  });

  test("flightExists returns false when rowCount == 0", async () => {
    flight_db.query = vi.fn().mockResolvedValue({ rowCount: 0 });
    const exists = await flightExists("AN000");
    expect(exists).toBe(false);
  });

  test("createFlight inserts and returns newly created flight", async () => {
    const newFlight = { flight_number: "AN999" };
    flight_db.query = vi.fn().mockResolvedValue({ rows: [newFlight] });

    const result = await createFlight({
      aircraft_id: 1,
      date: "2025-12-20",
      boarding_time: "08:00",
      departure_airport: "JFK",
      arrival_time: "11:00",
      arrival_airport: "LAX",
      gate: "5A",
      status: "Scheduled",
      flight_number: "AN999",
      departure_time: "08:30"
    });

    expect(result).toEqual(newFlight);
    expect(flight_db.query).toHaveBeenCalled();
  });

  test("getAvailableStaffForFlight returns rows", async () => {
    const rows = [{ staff_id: 1, first_name: "John" }];
    flight_db.query = vi.fn().mockResolvedValue({ rows });

    const result = await getAvailableStaffForFlight("AN123");
    expect(result).toBe(rows);
    expect(flight_db.query).toHaveBeenCalled();
  });
});