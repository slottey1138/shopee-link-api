const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { username, password, phone, role, status, created_by, updated_by } = req.body;

    const checkDuplicate = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            phone: phone,
          },
        ],
      },
    });

    if (checkDuplicate) {
      return res.status(400).json({
        message: "Username or Phone already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashPassword,
        phone: phone,
        role: role,
        status: 2,
        createdBy: created_by,
        updatedBy: updated_by,
      },
    });

    res.json({
      message: "Registration completed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { username, password, status, updated_by } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const checkDuplicate = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            phone: phone,
          },
        ],
        NOT: {
          user_id: Number(user_id),
        },
      },
    });

    if (checkDuplicate) throw new Error("Username or Phone already exists");

    const user = await prisma.user.update({
      where: { user_id: parseInt(id) },
      data: {
        username,
        status,
        password: hashPassword,
        updatedBy: updated_by,
      },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: { user_id: parseInt(id) },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUserCredit = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { credit } = req.body;

    await prisma.user.update({
      where: { user_id: parseInt(user_id) },
      data: {
        credit: Number(credit),
      },
    });
    res.json({
      message: "Update credit completed successfully.",
    });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "This user does not exist",
      });
    }

    // if (user.credit <= 0) {
    //   res.status(400).json({
    //     message: "This user has exprired",
    //   });
    // }

    const checkPassword = await bcrypt.compare(password, user?.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    const secret = process.env.JWT_SECRET;
    const secretKey = Buffer.from(secret, "utf8");

    delete user?.password;

    const token = await jwt.sign(user, secretKey, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    return res.json({
      token: token,
    });
  } catch (error) {
    next(error);
  }
};
