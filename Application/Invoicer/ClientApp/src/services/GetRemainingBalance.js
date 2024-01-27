import SETTINGS from "../AppSettings";

export default async function getRemainingBalance(companyID) {
    let balance = 0;
    let error = "";
    if (companyID !== 0) {
       /* await fetch(`${SETTINGS.COMPANIES_API_URI}/${companyID}${SETTINGS.REMAINING_BALANCE_URI}`)
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                balance = result;
            })
            .catch((returnedError) => {
                error = returnedError;
            });*/
    }
    else {
        error = ""
    }
    return { balance, error };
}