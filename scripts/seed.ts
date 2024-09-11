const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        {
          name: "Computer Science",
        },
        {
          name: "Fitness",
        },
        {
          name: "Photography",
        },
        {
          name: "Reading",
        },
      ],
    });
  } catch (error) {
    console.log("Error sending from database", error);
  } finally {
    await database.$disconnect();
  }
}

main();
