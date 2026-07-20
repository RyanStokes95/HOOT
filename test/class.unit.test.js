/**
 * Author: Ryan Stokes
 * File: class.unit.test.js
 */

import { generateClassCode } from "../src/controllers/teacherController.js";

// Unit tests for generateClassCode function
/*These tests verify the behavior of the generateClassCode function by checking its output against expected criteria 
such as:
-type
-length
-character composition
-uniqueness of consecutive calls
*/
describe("generateClassCode", () => {

    test("should return a string", () => {
        const code = generateClassCode();
        expect(typeof code).toBe("string");
    });

    test("should generate a code that is 6 characters long", () => {
        const code = generateClassCode();
        expect(code).toHaveLength(6);
    });

    test("should only contain uppercase letters and numbers", () => {
        const code = generateClassCode();
        expect(code).toMatch(/^[A-Z0-9]{6}$/);
    });

    test("should generate different codes on consecutive calls", () => {
        const code1 = generateClassCode();
        const code2 = generateClassCode();

        expect(code1).not.toBe(code2);
    });

});