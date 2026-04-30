import ProfileClient from "@/components/profile/ProfileClient";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      addresses: true,
      orders: {
        include: {
          items: {
            include: {
              book: {
                select: {
                  title: true,
                  image: true,
                  author: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const serializedUser = JSON.parse(JSON.stringify(user));

  return <ProfileClient initialData={serializedUser} />;
}
