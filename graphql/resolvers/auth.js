const { hash, compare } = require("bcryptjs");
const { User } = require("../../Models/user");
const { sign } = require("jsonwebtoken");

const login = async ({ email, password }) => {
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exists");
    }
    const check = await compare(password, user.password);
    if (!check) {
      throw new Error("Password is incorrect");
    }
    const token = sign({ userId: user.id, email: user.email }, "SECRET_KEY", {
      expiresIn: "1h",
    });
    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  login,
  createUser: async (args) => {
    let userByEmail = await User.findOne({ email: args.userInput.email });
    if (userByEmail) {
      throw new Error("User already exists");
    }
    let pwd = "";
    try {
      pwd = await hash(args.userInput.password, 12);
    } catch (err) {
      throw err;
    }
    const user = new User({
      email: args.userInput.email,
      password: pwd,
    });
    try {
      let dbRes = await user.save();
      // return { ...dbRes._doc, password: null };
      if (dbRes) {
        return await login({
          email: args.userInput.email,
          password: args.userInput.password,
        });
      }
    } catch (err) {
      throw err;
    }
  },
};
