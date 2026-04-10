const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const books = [
    {
      title: "The Silent Forest",
      author: "Elena Rossi",
      price: 599,
      description: "A gripping thriller that takes you deep into the heart of a mysterious forest where secrets are buried and the silence is deafening.",
      category: "Mystery",
      stock: 50,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Neon Dreams",
      author: "Marcus Vane",
      price: 749,
      description: "A cyberpunk odyssey through a sprawling metropolis where technology and humanity collide in a dance of neon and shadows.",
      category: "Sci-Fi",
      stock: 30,
      image: "https://images.unsplash.com/photo-1543004218-ee141104308e?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Culinary Alchemy",
      author: "Chef Isabella",
      price: 1250,
      description: "Master the art of high-end gastronomy with secrets from one of the world's most innovative kitchens.",
      category: "Lifestyle",
      stock: 20,
      image: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Whispers of History",
      author: "Prof. Julian Thorne",
      price: 899,
      description: "An evocative journey through the forgotten corridors of history, revealing the stories that shaped our civilization.",
      category: "History",
      stock: 40,
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Modern Minimalist",
      author: "Sarah Jenkins",
      price: 499,
      description: "A guide to decluttering your life and finding peace in simplicity within a chaotic modern world.",
      category: "Self-Help",
      stock: 100,
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop"
    }
  ];

  console.log("Seeding books...");

  for (const book of books) {
    await prisma.book.create({
      data: book
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
