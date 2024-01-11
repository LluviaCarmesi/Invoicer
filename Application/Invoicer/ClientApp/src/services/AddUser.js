import SETTINGS from "../AppSettings";

export default async function addUser(item) {

    await fetch(`${SETTINGS.GET_USERS_API}${SETTINGS.ADD_USER_API}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })
}