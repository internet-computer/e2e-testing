import { Identity } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export const DIR = `${__dirname}/../.keys`
export const PATH = `${DIR}/keys.json`;

export function getIdentity(name: string): Identity {
    if (!existsSync(PATH)) throw Error(`'${PATH}' does not exist.`);
    const keys = JSON.parse(readFileSync(PATH).toString());
    if (!keys[name]) throw Error(`Key with name ${name} not found.`);
    return Ed25519KeyIdentity.fromParsedJson(JSON.parse(keys.admin));
};

export function ensureIdentity(name: string): Identity {
    if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });
    if (!existsSync(PATH)) writeFileSync(PATH, "{}", { flag: "wx" });
    const keys = JSON.parse(readFileSync(PATH).toString());
    if (!keys[name]) {
        const key = Ed25519KeyIdentity.generate();
        keys[name] = JSON.stringify(key);
        writeFileSync(PATH, JSON.stringify(keys));
        return key;
    } else {
        return Ed25519KeyIdentity.fromParsedJson(JSON.parse(keys[name]));
    }
};
