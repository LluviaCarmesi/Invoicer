import SETTINGS from "../AppSettings";

export default async function getCompanies() {
    let companies = [];
    let error = "";
    /*await fetch(`${SETTINGS.GET_COMPANIES_URI}`)
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            companies = result;
        })
        .catch((returnedError) => {
            error = returnedError.message;
        });*/
    companies = [{id: 1, name: "Test"}];
    if (companies.length === 0 && !error) {
        error = "No companies exist.";
    }
    return { companies, error };
}