import dotenv from 'dotenv';
import { vi } from 'vitest';

dotenv.config();

// Shim jest to use vitest's vi
// @ts-ignore
globalThis.jest = vi;
