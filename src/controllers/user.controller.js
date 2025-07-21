const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
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

    if (checkDuplicate) {
      return res.status(400).json({
        message: "มีชื่อผู้ใช้ หรือ เบอร์โทรศัพท์นี้ในระบบแล้ว",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
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
      message: "ลงทะเบียนสำเร็จ",
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        user_id: Number(user_id),
      },
    });
    delete user.password;
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { username, status, updated_by, credit, phone } = req.body;

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

    if (checkDuplicate) throw new Error("มีชื่อผู้ใช้ หรือ เบอร์โทรศัพท์นี้ในระบบแล้ว");

    const user = await prisma.user.update({
      where: { user_id: parseInt(user_id) },
      data: {
        username: username,
        status: Number(status),
        credit: Number(credit),
        phone: phone,
      },
    });
    res.json({ message: "แก้ไขผู้ใข้งานสำเร็จ" });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await prisma.user.delete({
      where: { user_id: parseInt(user_id) },
    });
    res.json({ message: "ลบผู้ใข้งานสำเร็จ" });
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
        message: "ไม่มีผู้ใข้งานนี้ในระบบ",
      });
    }

    if (user.role === "USER" && user.credit <= 0) {
      res.status(400).json({
        message: "ชื่อผู้ใช้งานนี้หมดอายุ",
      });
    }

    const checkPassword = await bcrypt.compare(password, user?.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "รหัสผ่านไม่ถูกต้อง",
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
