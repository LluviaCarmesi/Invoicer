import SETTINGS from "../AppSettings";

export default async function addTransaction(item, companyID) {

    await fetch(`${SETTINGS.GET_COMPANIES_URI}/${companyID}${SETTINGS.ADD_TRANSACTION}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })
}