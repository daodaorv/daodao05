/**
 * 应用配置 - 移动管理端
 */

// 开发环境配置
const development = {
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000
};

// 生产环境配置
const production = {
  baseURL: 'https://api.daodao-fangche.com/api/v1',
  timeout: 10000
};

// 根据环境变量选择配置
const config = process.env.NODE_ENV === 'production' ? production : development;

export default config;

