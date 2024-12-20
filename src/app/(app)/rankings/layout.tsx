import { Trophy } from "lucide-react";

export default function RankingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 text-center bg-background pt-12">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full" />
          <Trophy className="h-16 w-16 text-primary relative" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            网站排行榜
          </h1>
          <p className="text-muted-foreground max-w-[600px]">
            发现最受欢迎的AI工具和网站，基于用户访问量和点赞数据实时更新
          </p>
        </div>
      </div>
      <div>{children}</div>
    </>
  );
}
