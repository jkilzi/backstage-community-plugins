export async function fetchJson(spec) {
    const response = await fetch(spec);
    const data = await response.json();
    return data;
}
