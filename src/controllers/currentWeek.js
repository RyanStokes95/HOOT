/**
 * Authors: Ryan Stokes
 * File: currentWeek.js
 * Last Modified: 2026-05-25
 */

import { Week } from "../models/Week.js";

// Function which sets the week start date
function getMonday(date = new Date()) {

    // Create a new Date object.
    const currentDate = new Date(date);

    // getDay() returns 0 for Sunday, 1 for Monday etc.
    const day = currentDate.getDay();

    let diff;

    // Sunday
    if (day === 0) {

        // Since Sunday is 0, we need a special case to set the week start date to the previous Monday instead of the following Monday
        // No need to add 1 because Sunday is already 0, so diff = currentDate.getDate() - 0 = currentDate.getDate()
        // eg. If it's Sunday (day = 0), we need to subtract 6 days to get back to the previous Monday.
        diff = currentDate.getDate() - 6;

    }

    // Monday to Saturday
    else {

        // getDate() returns the day of the month (1-31).
        // Because week starts at 0, 1 must be added to the day value to get the correct diff for Monday to Saturday.
        // eg. If it's Tuesday (day = 2), we need to subtract 1 day to get to Monday, so diff = currentDate.getDate() - (2 - 1) = currentDate.getDate() - 1
        diff = currentDate.getDate() - day + 1;

    }

    currentDate.setDate(diff);

    currentDate.setHours(0, 0, 0, 0);

    return currentDate;

}

// Function which sets the week end date to the following Friday at 11:59:59 PM
function getFriday(monday) {
    // Create a new Date object based on the Monday date passed in
    const friday = new Date(monday);
    // Since Friday is 4 days after Monday, we add 4 to the Monday date to get the Friday date
    friday.setDate(monday.getDate() + 4);
    // Set time to 11:59:59 PM on Friday
    friday.setHours(23, 59, 59, 999);

  return friday;
}

export async function getCurrentWeek(teacherClassId) {
    const weekStartDate = getMonday();
    const weekEndDate = getFriday(weekStartDate);

    const currentWeek = await Week.findOneAndUpdate(
        {
        teacherClass: teacherClassId,
        weekStartDate
        },
        // setOnInsert operator ensures that a new week document is only created if one doesmt already exist
        {
        $setOnInsert: {
            teacherClass: teacherClassId,
            weekStartDate,
            weekEndDate,
            weeklyFeedback: [],
            dailyHomework: []
        }
        },
        {
        // new: true option returns the existing document if found, or the newly created document if not found
        // upsert: true option creates a new document if no document matches the query
        new: true,
        upsert: true
        }
  );

  return currentWeek;
}

export { getMonday, getFriday };