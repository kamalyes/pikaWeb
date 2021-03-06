// https://umijs.org/config/
import {defineConfig} from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const {REACT_APP_ENV} = process.env;
export default defineConfig({
  hash: true,
  dva: {
    hmr: true,
  },
  antd: {
    dark: false,
  },
  history: {
    type: 'hash',
  },
  locale: {
    // default true, when it is true, will use `navigator.language` overwrite default
    default: 'zh-CN',
    antd: true,
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'border-radius-base': '3px',
    'font-size-base': '13px',
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
  lessLoader: {
    modifyVars: {
      'root-entry-name': 'default'
    }
  },
  chainWebpack(conf) {
    // ....other config
    conf.module
      .rule('mjs$')
      .test(/\.mjs$/)
      .include
      .add(/node_modules/)
      .end()
      .type('javascript/auto');
  },
});
