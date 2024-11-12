/**
 * This component renders a string describing how long ago a given timestamp was
 * relative to the current time. The timestamp is expected to be in ISO format.
 * If the timestamp is not provided, the component renders nothing.
 */
import { formatDistanceToNow, parseISO } from "date-fns";

function TimeAgo({ timestamp }) {
    /**
     * The string to be rendered.
     * If the timestamp is not provided, this will be an empty string.
     */
    let timeAgo = "";
    if (timestamp) {
        /**
         * Parse the timestamp into a Date object.
         * This is necessary because the formatDistanceToNow function requires a Date object.
         */
        const date = parseISO(timestamp);
        /**
         * Calculate the distance between the parsed date and the current time.
         * This is the string that will be rendered.
         */
        const timePeriod = formatDistanceToNow(date);
        /**
         * Append "ago" to the time period string.
         * This is the final string that will be rendered.
         */
        timeAgo = `${timePeriod} ago`;
    }

    /**
     * Render the timeAgo string.
     * If the timestamp was not provided, this will render nothing.
     */
    return (
        <span title={timestamp} >
            &nbsp; <i>{timeAgo}</i>
        </span>
    );
}

export default TimeAgo;
