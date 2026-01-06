import { createHash } from 'crypto';

export class SHA256Service {
  /**
   * Hash password/username menggunakan SHA-256
   */
  hash(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  /**
   * Compare input dengan hash (hash input dulu, lalu bandingkan)
   */
  compare(input: string, hash: string): boolean {
    const inputHash = this.hash(input);
    return inputHash === hash;
  }

  /**
   * Hash username menggunakan SHA-256
   */
  hashUsername(username: string): string {
    return this.hash(username);
  }

  /**
   * Hash password menggunakan SHA-256
   */
  hashPassword(password: string): string {
    return this.hash(password);
  }
}

