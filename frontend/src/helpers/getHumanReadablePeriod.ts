export function getHumanReadablePeriod(past: Date, future: Date): string {
    const seconds = (future.getTime() - past.getTime()) / 1000;
    if (seconds < 60) {
        return "seconds ago";
    } else if (seconds < 120) {
        return "1 minute ago";
    } else if (seconds < 60 * 60) {
        return `${(seconds / 60).toFixed(0)} minutes ago`;
    } else if (seconds < 60 * 60 * 24) {
        return `${(seconds / (60 * 60)).toFixed(0)} hours ago`;
    } else {
        return `${(seconds / (60 * 60 * 24)).toFixed(0)} days ago`;
    }
}