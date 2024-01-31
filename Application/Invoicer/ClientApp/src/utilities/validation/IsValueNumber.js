export default function isValueNumber(value) {
    if (typeof value === "number") {
        return true;
    }
    return !isNaN(parseInt(value));
}