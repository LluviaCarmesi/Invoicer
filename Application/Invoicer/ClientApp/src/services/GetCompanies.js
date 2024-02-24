import SETTINGS from "../AppSettings";
import ENUSStrings from "../strings/ENUSStrings";
import getCookie from "../utilities/GetCookie";
import isStatusGood from "../utilities/IsStatusGood";
import setCookie from "../utilities/SetCookie";

export default async function getCompanies(canAvoidCookie) {
    let companies = [];
    let doesErrorExist = false;
    let errorMessage = "";
    const allCompaniesCookie = getCookie(SETTINGS.COOKIE_KEYS.ALL_COMPANIES);
    if (!!allCompaniesCookie && !canAvoidCookie) {
        companies = JSON.parse(allCompaniesCookie);
    }
    else {
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
                    setCookie(SETTINGS.COOKIE_KEYS.ALL_COMPANIES, JSON.stringify(companies), 2);
                }
            })
            .catch((error) => {
                doesErrorExist = true;
                errorMessage = error;
                console.log(error);
            });
    }
    if (companies.length === 0 && !errorMessage) {
        doesErrorExist = true;
        errorMessage = ENUSStrings.NoCompaniesErrorMessage;
    }
    return { companies, doesErrorExist, errorMessage };
}