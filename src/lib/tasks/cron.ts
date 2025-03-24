import { CronJob } from "cron";
import { updateWebsiteThumbnails } from "../utils/update-thumbnails";
import { updateWebsiteActive } from "../utils/update-avtive";

// 每天凌晨3点执行
export const thumbnailUpdateJob = new CronJob(
  "0 3 * * *",
  async () => {
    console.log("开始执行缩略图更新任务");
    await updateWebsiteThumbnails();
    console.log("缩略图更新任务完成");
  },
  null,
  false,
  "Asia/Shanghai"
);

// 每天凌晨4点执行
export const websiteCheckJob = new CronJob(
  "0 4 * * *",
  async () => {
    console.log("开始检查网站可访问性");
    await updateWebsiteActive();
    console.log("网站检查任务完成");
  },
  null,
  false,
  "Asia/Shanghai"
);
