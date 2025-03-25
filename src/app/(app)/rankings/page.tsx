import { prisma } from "@/lib/prisma";
import { RankingsClient } from "@/components/website/rankings-client";

export default async function RankingsPage() {
  // 获取访问量前五的网站
  const topVisits = await prisma.website.findMany({
    where: {
      status: "approved",
    },
    orderBy: { visits: "desc" },
    take: 5,
  });

  // 获取点赞数前五的网站
  const topLikes = await prisma.website.findMany({
    where: {
      status: "approved",
    },
    orderBy: { likes: "desc" },
    take: 5,
  });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="max-w-4xl mx-auto">
            <RankingsClient 
              topVisits={topVisits} 
              topLikes={topLikes} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
