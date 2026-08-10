/**
 * 净证 - 全局站点配置文件
 * 此文件作为 AstroWind 原有 config.yaml 的补充，
 * 提供品牌信息、联系方式、社交媒体等自定义配置。
 * AstroWind 核心配置（SITE/I18N/METADATA/APP_BLOG/UI/ANALYTICS）仍由 config.yaml 管理。
 */

// ============================================================
// 站点基础信息 (SITE)
// ============================================================
export const SITE = {
  /** 站点标题，用于 SEO 和浏览器标签页 */
  title: '净证-酒店保洁管理系统_客房质检软件',

  /** 站点描述，用于 SEO meta description */
  description:
    '让每一间客房的清洁，都有据可查。净证客房保洁质检系统，专为中小酒店设计，支持拍照提交、主管在线审核、一键生成报表。',

  /** 默认语言 */
  defaultLanguage: 'zh-CN',

  /** 站点域名（上线后替换为实际域名） */
  siteUrl: 'https://yourdomain.com' /* 【待替换】 */,

  /** 站点基准路径 */
  base: '/',
} as const;

// ============================================================
// 品牌信息 (BRAND)
// ============================================================
export const BRAND = {
  /** 品牌名称 */
  name: '净证',

  /** 品牌口号 */
  slogan: '让每一间客房的清洁，都有据可查',

  /** 品牌 Logo 路径（待上传后替换） */
  logo: '/assets/images/logo.png' /* 【待替换】 */,

  /** 品牌 Favicon 路径 */
  favicon: '/assets/favicons/favicon.ico' /* 【待替换】 */,
} as const;

// ============================================================
// 联系方式 (CONTACT)
// ============================================================
export const CONTACT = {
  /** 联系邮箱 */
  email: 'your-email@yourdomain.com' /* 【待替换】 */,

  /** 联系电话 */
  phone: '+86-000-0000-0000' /* 【待替换】 */,

  /** 联系地址 */
  address: '请填写公司地址' /* 【待替换】 */,

  /** 工作时间 */
  workingHours: '周一至周五 9:00-18:00' /* 【待替换】 */,
} as const;

// ============================================================
// 社交媒体链接 (SOCIAL)
// ============================================================
export const SOCIAL = {
  /** 微信公众号 */
  wechat: 'https://mp.weixin.qq.com/your-account' /* 【待替换】 */,

  /** 微博 */
  weibo: 'https://weibo.com/your-account' /* 【待替换】 */,

  /** 知乎 */
  zhihu: 'https://www.zhihu.com/people/your-account' /* 【待替换】 */,

  /** GitHub */
  github: 'https://github.com/your-org' /* 【待替换】 */,

  /** 抖音 */
  douyin: 'https://www.douyin.com/user/your-account' /* 【待替换】 */,

  /** 小红书 */
  xiaohongshu: 'https://www.xiaohongshu.com/user/your-account' /* 【待替换】 */,
} as const;
