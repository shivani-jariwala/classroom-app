const bcrypt = require("bcrypt");
const HttpStatus = require("http-status-codes");
const {generateAuthToken} = require("../../helpers/auth");
const logger = require("../../log");
const db = require("../../db/auth/login");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //example body request
    //const body = {
    //    email: "test",
    //    password: "test"
    // }
    //incomplete body request
    if (!Object.keys(req.body).length || !email || !password)
      return res.status(HttpStatus.BAD_REQUEST).json({
        errorMessage: "Email/Password not found",
        message: "failure",
      });
    const [result] = await db.findUserByEmail(email);
    logger.debug({result}, '[auth/controller/login.js] [login]');
    if (result.length === 0)
      return res.status(HttpStatus.CONFLICT).json({
        errorMessage: "User not found",
        message: "failure",
      });
    //compare passwords
    // let passwordMatched = await bcrypt.compare(password, result[0].password)
    // if (!passwordMatched) return res.status(HttpStatus.FORBIDDEN).json({
    //     errorMessage: `Incorrect Password`,
    //     message: 'failure',
    //   });
    const token = generateAuthToken(
      result[0].id,
      result[0].email,
      result[0].type
    );
    return res
      .set({
        Authorization: token,
        "Access-Control-Expose-Headers": "Authorization",
      })
      .status(HttpStatus.OK)
      .json({
        message: "success",
        token: token,
      });
  } catch (err) {
    logger.error({err}, '[auth/controller/login.js] [err] [login]');
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errors.randomError(err.message));
  }
};
