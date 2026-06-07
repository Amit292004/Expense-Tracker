const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const categories = [
  // Expense Categories
  { name: "Food & Dining", type: "EXPENSE", icon: "Utensils", color: "#f87171" },
  { name: "Housing & Rent", type: "EXPENSE", icon: "Home", color: "#60a5fa" },
  { name: "Utilities", type: "EXPENSE", icon: "Zap", color: "#fbbf24" },
  { name: "Transportation", type: "EXPENSE", icon: "Car", color: "#34d399" },
  { name: "Entertainment", type: "EXPENSE", icon: "Film", color: "#a78bfa" },
  { name: "Shopping", type: "EXPENSE", icon: "ShoppingBag", color: "#f472b6" },
  { name: "Healthcare", type: "EXPENSE", icon: "HeartPulse", color: "#2dd4bf" },
  { name: "Travel", type: "EXPENSE", icon: "Plane", color: "#fb7185" },
  { name: "Education", type: "EXPENSE", icon: "GraduationCap", color: "#818cf8" },
  { name: "Other Expense", type: "EXPENSE", icon: "Coins", color: "#9ca3af" },
  
  // Income Categories
  { name: "Salary", type: "INCOME", icon: "Briefcase", color: "#34d399" },
  { name: "Freelance & Side Hustle", type: "INCOME", icon: "Laptop", color: "#60a5fa" },
  { name: "Investments", type: "INCOME", icon: "TrendingUp", color: "#a78bfa" },
  { name: "Gifts & Grants", type: "INCOME", icon: "Gift", color: "#fb7185" },
  { name: "Other Income", type: "INCOME", icon: "DollarSign", color: "#fbbf24" }
];

async function main() {
  console.log("Seeding categories...");
  
  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: cat.name,
        type: cat.type
      }
    });
    
    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          color: cat.color
        }
      });
      console.log(`Created category: ${cat.name} (${cat.type})`);
    } else {
      console.log(`Skipped existing category: ${cat.name}`);
    }
  }
  
  console.log("Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
