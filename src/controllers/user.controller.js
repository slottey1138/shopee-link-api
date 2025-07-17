const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const { username, password, role, status, created_by, updated_by } = req.body;

  const checkUsername = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (checkUsername) {
    return res.status(200).json({
      message: "Username already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username: username,
      password: hashPassword,
      role: role,
      status: status,
      createdBy: created_by,
      updatedBy: updated_by,
    },
  });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, status, updated_by } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  const checkUsername = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (checkUsername) {
    return res.status(200).json({
      message: "Username already exists",
    });
  }

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
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: { user_id: parseInt(id) },
  });
  res.json(user);
};
