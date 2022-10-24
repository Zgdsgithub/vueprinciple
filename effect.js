/*
 * @Author: zhanggd
 * @Date: 2022-10-24 16:46:29
 * @LastEditors: zhanggd
 * @LastEditTime: 2022-10-24 16:47:56
 * @Description: 副作用函数
 */
/**
 * @desc: 注册影响函数
 * @return: {*}
 * @param {*} fn 影响函数
 */
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn); // 压入栈
    const res = fn();
    effectStack.pop(); // fn执行完后弹出
    activeEffect = effectStack[effectStack.length - 1]; // 使当前激活函数指向栈顶
    return res;
  };
  effectFn.options = options;
  effectFn.deps = [];
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}
