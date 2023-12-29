export default function changeQueryParameter(queryParam, value) {
    const url = new URL(window.location.href);
    const queryParameter = new URLSearchParams(window.location.search);
    queryParameter.set(queryParam, value);
    window.history.pushState(null, "", url.origin + url.pathname + "?" + queryParameter.toString());
}