﻿import SETTINGS from "../AppSettings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function editCompany(item, companyID) {
    let doesErrorExist = false;
    let errorMessage = "";
    await fetch(`${SETTINGS.COMPANIES_API_URI}${SETTINGS.EDIT_COMPANY_URI}/${companyID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
        .then((response) => {
            doesErrorExist = !isStatusGood(response.status);
            return response.json();
        })
        .then((result) => {
            if (doesErrorExist) {
                errorMessage = result.response;
            }
        })
        .catch((error) => {
            doesErrorExist = true;
            errorMessage = error;
            console.log(error);
        });
    return { doesErrorExist, errorMessage };
}