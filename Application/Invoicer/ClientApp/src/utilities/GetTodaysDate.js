export default function getTodaysDate() {
    const todaysDate = new Date();
    const month = todaysDate.getMonth() + 1;
    return `${todaysDate.getFullYear()}-${month < 10 ? ("0" + month) : month}-${todaysDate.getDate() < 10 ? ("0" + todaysDate.getDate()) : todaysDate.getDate()}`;
}