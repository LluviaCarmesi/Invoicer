export default function loadingMessage(loadingMessageID, initialMessage, currentMessage) {
    let string = currentMessage;
    setTimeout(() => {
        const loadingElement = document.getElementById(loadingMessageID);
        if (!!loadingElement && loadingElement.getAttribute("hidden") !== "") {
            if (string.indexOf("...") !== -1) {
                string = initialMessage;
            }
            else {
                string += ".";
            }
            loadingElement.innerHTML = "<span>" + string + "<span>";
            loadingMessage(loadingMessageID, initialMessage, string);
        }
    }, 500);
};