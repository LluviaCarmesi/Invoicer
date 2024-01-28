export default function formatDate(date) {
    if (!date) {
        return "";
    }
    const month = date.getMonth() + 1;
    return `${date.getFullYear()}-${month < 10 ? ("0" + month) : month}-${date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()}`;
}