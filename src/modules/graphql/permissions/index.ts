import { fileLoader } from "merge-graphql-schemas";
import path from 'path';

const shieldFiles = fileLoader(path.join(__dirname, '/shields/*.shield.js'));
const shields: any = [];

for (const key in shieldFiles) {
    if (shieldFiles.hasOwnProperty(key)) {
        const shield = shieldFiles[key];

        Object.assign(shields, shield.permissions);
    }
}

export const readyShield = shields;