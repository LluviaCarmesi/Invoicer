import SETTINGS from "../AppSettings";

export default async function getCompanyTransactions(companyID) {
    let transactions = [];
    let error = "";
    if (companyID !== 0) {
        await fetch(`${SETTINGS.GET_COMPANIES_URI}/${companyID}${SETTINGS.TRANSACTIONS_URI}`)
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                transactions = result;
            })
            .catch((returnedError) => {
                error = returnedError;
            });
    }
    if (transactions.length === 0 && !error) {
        error = "No transactions exist for this company";
    }
    return { transactions, error };
}