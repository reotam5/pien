export async function getResponse(response: Response) {
    const { status, statusText } = response;
    const data = await response.json();
    return { status, statusText, data };
}