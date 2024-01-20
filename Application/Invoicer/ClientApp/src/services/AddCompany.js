import SETTINGS from "../AppSettings";

export default async function addCompany(item) {

    await fetch(`${SETTINGS.GET_COMPANIES_URI}${SETTINGS.ADD_COMPANY_URI}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
        })
        .then((response) => {
            console.log(response);
            return response.json();
        })
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })
}