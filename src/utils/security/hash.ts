import * as bcrypt from 'bcrypt';

export const Hash = async (data: any) => {
  const hashed = await bcrypt.hash(data, 10);
  return hashed;
};

export const Compare = async (
  data: string,
  hashedData: string,
) => {
  const compare: boolean = await bcrypt.compare(data, hashedData);
  return compare;
};
