import SETTINGS from "../AppSettings";

export default async function getCompanyTransactions(companyID) {
    let transactions = [];
    let error = "";
    if (companyID !== 0) {
        /*await fetch(`${SETTINGS.GET_COMPANIES_URI}/${companyID}${SETTINGS.TRANSACTIONS_URI}`)
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                transactions = result;
            })
            .catch((returnedError) => {
                error = returnedError;
            });*/
    }
    transactions = [{
        id: 1,
        type: "fuel",
        createdDate: new Date("12/30/2023"),
        dueDate: new Date("01/30/2024"),
        checkNumber: "4",
        total: 42
    }];
    if (transactions.length === 0 && !error) {
        error = "No transactions exist for this company";
    }
    return { transactions, error };
}