import bcryptjs from "bcryptjs";

export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};
export const comparePasswords = async (candidatePassword, hashedPassword) => {
  const isMatch = await bcryptjs.compare(candidatePassword, hashedPassword);
  return isMatch;
};
