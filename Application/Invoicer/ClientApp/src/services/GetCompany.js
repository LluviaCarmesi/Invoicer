import SETTINGS from "../AppSettings";
import isStatusGood from "../utilities/IsStatusGood";

export default async function getCompany(companyID) {
    let company = {};
    let doesErrorExist = false;
    let errorMessage = "";
    await fetch(`${SETTINGS.COMPANIES_API_URI}/${companyID}`)
        .then((response) => {
            doesErrorExist = !isStatusGood(response.status);
            return response.json();
        })
        .then((result) => {
            if (doesErrorExist) {
                errorMessage = result.response;
            }
            else {
                company = result;
            }
        })
        .catch((error) => {
            doesErrorExist = true;
            errorMessage = error;
            console.log(error);
        });
    return { company, doesErrorExist, errorMessage };
}