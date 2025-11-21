import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
export const dateTimeLocalToUTC = (startDate, startTime, endDate, endTime, timezone) => {
    const start = dayjs.tz(dayjs(startDate).format("YYYY-MM-DD") + " " + startTime, timezone).utc().format();
    const end = dayjs.tz(dayjs(endDate).format("YYYY-MM-DD") + " " + endTime, timezone).utc().format();
    return { startDate: start, endDate: end }
}
