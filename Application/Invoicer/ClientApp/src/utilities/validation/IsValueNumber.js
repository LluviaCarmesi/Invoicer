export default function isValueNumber(value) {
    if (typeof value === "number") {
        return true;
    }
    if (!isNaN(parseInt(value))) {
        return true;
    }
    return false;
}