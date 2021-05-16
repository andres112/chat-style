import { customAlphabet } from "nanoid";

export const User = function(data) {
  const user = {
    uid: data.user?.uid,
    name: data.user?.displayName,
    email: data.user?.email,
    photo: data.user?.photoURL,
  };
  return user;
};

export const CreateTestID = function() {
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
  return nanoid();
};
