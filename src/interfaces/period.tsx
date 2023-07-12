export default interface Period {

    /**
     * Beginning date of the period
     */
    dateFrom : Date,

    /**
     * Ending date of the period
     */
    dateTo: Date
}

/**
 * Generate an array of period containing each month from now to 2 years ago.
 * The oldest perdiod possible is May 2023
 */
export function generateTwoYearsFromMonths(): Period[] {
    const periods: Period[] = [];
    const currentDate = new Date();

    // Start from the current month and go back 24 months
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

    for (let i = 0; i < 24; i++) {
        if (year > 2023 || (year === 2023 && month >= 4)) {
            const dateFrom = new Date(year, month, 1);
            const dateTo = new Date(year, month + 1, 0);
            periods.unshift({dateFrom, dateTo});
        }

        if (month === 0) {
            month = 11;
            year--;
        } else {
            month--;
        }
    }
    return periods;
}