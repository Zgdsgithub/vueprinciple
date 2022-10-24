/*
 * @Author: zhanggd
 * @Date: 2022-10-24 16:47:25
 * @LastEditors: zhanggd
 * @LastEditTime: 2022-10-24 16:48:55
 * @Description: 刷新队列（只要头尾）
 */
const jobQuene = new Set();
const p = Promise.resolve();

let isFlushing = false;
function flushJob() {
  if (isFlushing) return;
  isFlushing = true;
  p.then(() => jobQuene.forEach((job) => job())).finally(
    () => (isFlushing = false)
  );
}
