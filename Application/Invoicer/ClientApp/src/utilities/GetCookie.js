export default function getCookie(name) {
    name = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieValuePairs = decodedCookie.split(";");
    for (let i = 0; i < cookieValuePairs.length; i++) {
        const currentPair = cookieValuePairs[i];
        if (currentPair.indexOf(name) === 0) {
            return currentPair.substring(name.length, currentPair.length);
        }
    }
    return "";
}