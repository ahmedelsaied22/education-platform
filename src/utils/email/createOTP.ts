import { customAlphabet } from "nanoid";

export const generateOTP = customAlphabet('0123456789', 6)
