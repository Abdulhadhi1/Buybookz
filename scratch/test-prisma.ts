import prisma from "../src/lib/prisma";

async function test() {
  try {
    console.log("Fetching banners...");
    const banners = await prisma.banner.findMany();
    console.log("Banners count:", banners.length);
    
    console.log("Testing banner creation...");
    const testBanner = await prisma.banner.create({
      data: {
        image: "https://via.placeholder.com/1200x400",
        title: "Test Banner",
        link: "/shop"
      }
    });
    console.log("Created banner:", testBanner.id);
    
    console.log("Cleaning up...");
    await prisma.banner.delete({ where: { id: testBanner.id } });
    console.log("Done.");
  } catch (err) {
    console.error("PRISMA TEST FAILED:", err);
  } finally {
    process.exit();
  }
}

test();
