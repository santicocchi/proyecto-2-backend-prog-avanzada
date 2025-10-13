// src/common/helpers/hash.helper.ts
import { hashSync, compareSync } from 'bcrypt';

export const HashHelper = {
  hash: (plain: string) => hashSync(plain, 10),
  compare: (plain: string, hashed: string) => compareSync(plain, hashed),
};
