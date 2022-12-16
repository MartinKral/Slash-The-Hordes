export function formatString(text: string, params: string[]): string {
    let textWithParams = text;
    for (let i = 0; i < params.length; i++) {
        textWithParams = textWithParams.replace(`{${i}}`, params[i]);
    }

    return textWithParams;
}
