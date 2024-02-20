export default function setCookie(name, value, expires) {
    if (!!expires) {
        document.cookie = `${name}=${value};expires=${expires}`;
    }
    else {
        document.cookie = `${name}=${value}`;
    }
}