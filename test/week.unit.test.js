/**
 * Author: Ryan Stokes
 * File: week.unit.test.js
 */

import { getMonday, getFriday } from "../src/controllers/currentWeek.js";

// Unit tests for current week calculation functions. getCurrentWeek(), getMonday() & getFriday()
describe("Current Week Calculation", () => {
    it("calculates Monday and Friday for a Wednesday", () => {
        const testDate = new Date(2026, 4, 27, 12, 0, 0);

        const weekStartDate = getMonday(testDate);
        const weekEndDate = getFriday(weekStartDate);

        expect(weekStartDate.getFullYear()).toBe(2026);
        expect(weekStartDate.getMonth()).toBe(4);
        expect(weekStartDate.getDate()).toBe(25);

        expect(weekEndDate.getFullYear()).toBe(2026);
        expect(weekEndDate.getMonth()).toBe(4);
        expect(weekEndDate.getDate()).toBe(29);
    });
});