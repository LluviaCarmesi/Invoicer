import SETTINGS from "../AppSettings";

export default async function getUsers() {
    let users = [];
    let error = "";
    /*await fetch(`${SETTINGS.USERS_API_URI}`)
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            companies = result;
        })
        .catch((returnedError) => {
            error = returnedError.message;
        });*/
    users = [{ id: 1, firstName: "Test" }];
    if (users.length === 0 && !error) {
        error = "No users exist.";
    }
    return { users, error };
}