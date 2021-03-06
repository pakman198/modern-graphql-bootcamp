import getUserId from '../utils/getUserId';

const User = {
  email(parent, args, { request }, info) {
    const userId = getUserId(request, false);

    if(userId && userId === parent.id) {
      return parent.email;
    }

    return null;
  },
  password(parent, args, { request }, info) {
    const userId = getUserId(request, false);

    if(userId && userId === parent.id) {
      return parent.password;
    }

    return null;
  }
}

export default User;
