const deleteAttributes = (users) => {
  return users.map((user) => {
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    return user;
  });
};

module.exports = {
  deleteAttributes,
};
