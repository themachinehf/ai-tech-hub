const Hexo = require('hexo');
const hexo = new Hexo(__dirname, {});
hexo.init().then(() => {
  return hexo.load();
}).then(() => {
  return hexo.generate();
}).then(() => {
  console.log('生成完成');
  process.exit(0);
}).catch(err => {
  console.error('错误:', err);
  process.exit(1);
});
