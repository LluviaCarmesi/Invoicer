export default function isValueNumber(value) {
    if (typeof value === "number") {
        return true;
    }
    console.log(isNaN(parseInt(value)));
    if (!isNaN(parseInt(value))) {
        return true;
    }
    return false;
}