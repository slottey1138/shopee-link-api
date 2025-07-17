const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.updateCredit = async (req, res, next) => {
  try {
    await prisma.user.updateMany({
      where: {
        credit: {
          gt: 0,
        },
      },
      data: {
        credit: {
          increment: -1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
