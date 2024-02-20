export default function setCookie(name, value, minutesUntilExpiry) {
    if (!!minutesUntilExpiry) {
        let expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (minutesUntilExpiry*60*1000));
        document.cookie = `${name}=${value};expires=${minutesUntilExpiry}`;
    }
    else {
        document.cookie = `${name}=${value}`;
    }
}