import SETTINGS from "../AppSettings";

export default async function getRemainingBalance(companyID) {
    let balance = 0;
    let error = "";
    if (companyID !== 0) {
        await fetch(`${SETTINGS.GET_COMPANIES_URI}/${companyID}${SETTINGS.REMAININGBALANCE_URL}`)
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                balance = result;
            })
            .catch((returnedError) => {
                error = returnedError;
            });
    }
    else {
        error = ""
    }
    return { balance, error };
}