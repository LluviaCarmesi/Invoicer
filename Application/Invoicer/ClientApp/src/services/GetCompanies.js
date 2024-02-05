﻿import SETTINGS from "../AppSettings";
import ENUSStrings from "../strings/ENUSStrings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function getCompanies() {
    let companies = [];
    let doesErrorExist = false;
    let errorMessage = "";
    await fetch(`${SETTINGS.COMPANIES_API_URI}`)
        .then((response) => {
            doesErrorExist = !isStatusGood(response.status);
            return response.json();
        })
        .then((result) => {
            if (doesErrorExist) {
                errorMessage = result.response;
            }
            else {
                companies = result;
            }
        })
        .catch((error) => {
            doesErrorExist = true;
            errorMessage = error;
            console.log(error);
        });
    if (companies.length === 0 && !errorMessage) {
        doesErrorExist = true;
        errorMessage = ENUSStrings.NoCompaniesErrorMessage;
    }
    return { companies, doesErrorExist, errorMessage };
}