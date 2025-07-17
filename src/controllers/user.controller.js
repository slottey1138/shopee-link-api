const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, phone, role, created_by, updated_by } = req.body;

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

    if (checkDuplicate) throw new Error("Username or Phone already exists");

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
    res.json(user);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateUser = async (req, res) => {
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
    throw new Error(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: { user_id: parseInt(id) },
    });
    res.json(user);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateUserCredit = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { credit } = req.body;

    const user = await prisma.user.update({
      where: { user_id: parseInt(user_id) },
      data: {
        credit: credit,
        updatedBy: updated_by,
      },
    });
    res.json(user);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const secret = precess.env.JWT_SECRET;

    const secretKey = Buffer.from(secret, "utf8");

    const checkUser = prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!checkUser) throw new Error("ไม่มีผู้ใช้นี้ในระบบ");

    // const checkPassword = await
  } catch (error) {}
};
