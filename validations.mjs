export const isAlreadyPresent = (db, value, key = "email") => {
  return db.users.find((i) => i[key].toString() === value.toString());
};

export const isUserPresent = (db, id) => {
  const index = db.users.findIndex((i) => i.id.toString() === id.toString());
  if (!~index) {
    return null;
  }
  return {
    index,
    user: db.users[index],
  };
};
