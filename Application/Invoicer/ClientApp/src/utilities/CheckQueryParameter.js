export default function checkQueryParameter(queryParam) {
    return new URLSearchParams(window.location.search).get(queryParam);
}