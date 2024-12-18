import { z } from "zod";

export class AjaxResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  code: number = 200;

  constructor(
    success: boolean,
    data: T | null,
    message: string = "",
    code: number = 200
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.code = code;
  }

  static ok<T>(data: T): AjaxResponse<T> {
    return new AjaxResponse<T>(true, data, "", 200);
  }

  static fail<T>(message: string, code: number = 500): AjaxResponse<T> {
    return new AjaxResponse<T>(false, null, message, code);
  }
}

export interface Website {
  id: number;
  title: string;
  url: string;
  description: string;
  category_id: number;
  thumbnail?: string;
  status: "pending" | "approved" | "rejected" | "all";
  visits: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface FormInputs {
  title: string;
  url: string;
  description: string;
  category_id: string;
  thumbnail?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishDate: string;
  thumbnail?: string;
  tags: string[];
}

export interface Settings {
  id: number;
  key: string;
  value: string;
  updated_at: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  created_at: Date;
  updated_at: Date;
}

export const newsSchema = z.object({
  title: z
    .string()
    .min(2, "标题至少需要2个字符")
    .max(100, "标题不能超过100个字符"),
  summary: z
    .string()
    .min(10, "摘要至少需要10个字符")
    .max(500, "摘要不能超过500个字符"),
  source: z.string().min(1, "请输入来源"),
  sourceUrl: z.string().url("请输入有效的来源链接"),
  publishDate: z.string(),
  thumbnail: z.string().url("请输入有效的图片地址").optional(),
  tags: z.array(z.string()),
});

export interface ApiResponse<T> {
  code: number;
  success: boolean;
  data: T;
  message: string;
}

export type CategoryResponse = ApiResponse<Category[]>;


export enum WebsiteSettings {
  title = 'title',
  description = 'description', 
  keywords = 'keywords',
  logo = 'logo',
  siteIcp = 'siteIcp',
  siteFooter = 'siteFooter',
  allowSubmissions = 'allowSubmissions',
  requireApproval = 'requireApproval',
  itemsPerPage = 'itemsPerPage',
  adminPassword = 'adminPassword',
  siteUrl = 'siteUrl',
  siteEmail = 'siteEmail',
  siteCopyright = 'siteCopyright',
  googleAnalytics = 'googleAnalytics',
  baiduAnalytics = 'baiduAnalytics',
  customHtml = 'customHtml'
}