import { nanoid } from "nanoid";
export const generateShortID = (length) => {
    return nanoid(length);
}