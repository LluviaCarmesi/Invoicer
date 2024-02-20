export default function getCookie(name) {
    name = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieValuePairs = decodedCookie.split(";");
    for (let i = 0; i < cookieValuePairs.length; i++) {
        let currentPair = cookieValuePairs[i];
        while (currentPair[0] === " ") {
            currentPair = currentPair.substring(1);
        }
        if (currentPair.indexOf(name) === 0) {
            return currentPair.substring(name.length, currentPair.length);
        }
    }
    return "";
}