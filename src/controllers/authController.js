import { User } from '../models/users';
import { hashPass, passMatch } from '../helpers/password_helpers';
import successResponse from '../helpers/successResponse';
import handleError from '../helpers/errorHelper';

const createUser = (req, res) => {
  if (req.foundUser)
    handleError(res, `User ${req.foundUser.username} already registered`, 409);
  else {
    const newUser = new User(req.body);
    newUser.password = hashPass(newUser.password);
    newUser.save(1).then(({ rows }) => successResponse(res, rows[0], 201));
  }
};

const loginUser = ({ body, foundUser }, res) => {
  if (foundUser) {
    const { password, ...user } = foundUser;
    passMatch(body.password, foundUser.password).then(match =>
      match
        ? successResponse(res, { user })
        : handleError(res, `Password incorrect`, 400)
    );
  } else handleError(res, `User ${body.username} not registered`, 401);
};

export default {
  createUser,
  loginUser,
};
