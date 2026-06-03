function validateShortText(value: string): string | null {
    if (value.length > 20) {
        return 'Value must be 20 characters or less and can only contain letters, numbers, and underscores';
    }

    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);

        if (code >= 48 && code <= 57) { continue; }
        if (code >= 65 && code <= 90) { continue; }
        if (code >= 97 && code <= 122) { continue; }
        if (code === 95) { continue; }

        return 'Value must be 20 characters or less and can only contain letters, numbers, and underscores';
    }

    return null;
}

function validateStrongPassword(value: string): string | null {
    if (value.length < 8) {
        return 'Password must be at least 8 characters long, with at least 1 symbol, 1 uppercase character, 2 numbers, and 1 lowercase character';
    }

    let symbols = 0;
    let uppercase = 0;
    let numbers = 0;
    let lowercase = 0;

    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);

        if (code >= 48 && code <= 57) { numbers++; continue; }
        if (code >= 65 && code <= 90) { uppercase++; continue; }
        if (code >= 97 && code <= 122) { lowercase++; continue; }

        symbols++;
    }

    if (symbols < 1) {
        return 'Password must include at least 1 symbol';
    }

    if (uppercase < 1) {
        return 'Password must include at least 1 uppercase character';
    }

    if (numbers < 2) {
        return 'Password must include at least 2 numbers';
    }

    if (lowercase < 1) {
        return 'Password must include at least 1 lowercase character';
    }

    return null;
}

export { validateShortText, validateStrongPassword };