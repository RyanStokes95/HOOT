/**
 * Author: Ryan McMahon
 * File: week.int.test.js
 * Last Modified: 2026-05-25
 */

import request from "supertest";
import app from "../src/app.js";
import { getMonday, getFriday } from "../src/controllers/currentWeek.js";

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