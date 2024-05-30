import isValueNumber from "./validation/IsValueNumber";

export default function formatCurrency(value, type) {
    if (!isValueNumber(value)) {
        return value;
    }

    switch (type) {
        default:
            return "$" + value.toFixed(2);
    }
}