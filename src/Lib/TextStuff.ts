import { createHash } from 'crypto';

function sha256(input: string): string {
    return createHash('sha256').update(input + process.env.SALT).digest('hex');
}

function rndStr(length: number): string {
    const chars = 'abcedf1234567890';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default { sha256, rndStr }