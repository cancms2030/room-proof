import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: '首页',
      href: getPermalink('/'),
    },
    {
      text: '功能',
      href: getPermalink('/features/'),
    },
    {
      text: '博客',
      href: getBlogPermalink(),
    },
    {
      text: '案例',
      href: '#', // 页面暂未创建，用 # 占位
    },
    {
      text: '联系我们',
      href: getPermalink('/contact'),
    },
  ],
  actions: [{ text: '免费试用', href: getPermalink('/contact') }],
};

export const footerData = {
  links: [
    {
      title: '产品',
      links: [
        { text: '功能介绍', href: '/#features' },
        { text: '定价方案', href: getPermalink('/pricing') },
        { text: '关于我们', href: getPermalink('/about') },
      ],
    },
    {
      title: '支持',
      links: [
        { text: '帮助中心', href: '#' },
        { text: '常见问题', href: '#' },
        { text: '联系我们', href: getPermalink('/contact') },
      ],
    },
    {
      title: '资源',
      links: [
        { text: '博客', href: getBlogPermalink() },
        { text: '用户案例', href: '#' },
      ],
    },
    {
      title: '法律',
      links: [
        { text: '服务条款', href: getPermalink('/terms') },
        { text: '隐私政策', href: getPermalink('/privacy') },
      ],
    },
  ],
  secondaryLinks: [
    { text: '服务条款', href: getPermalink('/terms') },
    { text: '隐私政策', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: '微信', icon: 'tabler:brand-wechat', href: '#' },
    { ariaLabel: '微博', icon: 'tabler:brand-weibo', href: '#' },
  ],
  footNote: `
    © ${new Date().getFullYear()} 净证 · 让每一间客房的清洁，都有据可查
  `,
};
