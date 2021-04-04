export const User = function(data) {
  const user = {
    uid: data.user?.uid,
    name: data.user?.displayName,
    email: data.user?.email,
    photo: data.user?.photoURL,
  };
  return user;
};
