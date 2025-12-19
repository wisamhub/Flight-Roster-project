import { describe, test, expect, beforeAll } from "vitest";

let validateFlightData;

describe("validateFlightData", () => {
  beforeAll(async () => {
    const module = await import("../Database/connection.js");
    validateFlightData = module.validateFlightData;
  });

  test("valid flight data returns empty errors", () => {
    const valid = {
      flight_number: "AN251",
      aircraft_id: "1",
      departure_airport: "JFK",
      arrival_airport: "LAX",
      date: "2025-12-20",
      gate: "12A",
      boarding_time: "09:00",
      departure_time: "09:30",
      arrival_time: "12:00",
      status: "Scheduled"
    };

    const errors = validateFlightData(valid);
    expect(errors).toEqual([]);
  });

  test("invalid flight data returns errors", () => {
    const invalid = {
      flight_number: "123",
      aircraft_id: "-1",
      departure_airport: "JF",
      arrival_airport: "JF",
      date: "20-12-2025",
      gate: "A",
      boarding_time: "9:00",
      departure_time: "25:30",
      arrival_time: "12:99",
      status: "Flying"
    };

    const errors = validateFlightData(invalid);
    expect(errors.length).toBeGreaterThan(0);
  });
});