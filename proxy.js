/*
 * @Author: zhanggd
 * @Date: 2022-10-18 13:48:57
 * @LastEditors: zhanggd
 * @LastEditTime: 2022-10-24 16:44:16
 * @Description: 响应式数据获取与设置
 */
/**
 * @desc: 获取
 * @return: {*}
 * @param {*} target 对象
 * @param {*} key 对象属性
 */
function track(target, key) {
  if (!activeEffect) return target[key];
  // map
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  // set
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect); // 放到set里面
  activeEffect.deps.push(deps);
  console.log(target, key, "获取到obj.text");
}

/**
 * @desc: 设置
 * @return: {*}
 * @param {*} target 对象
 * @param {*} key 对象属性
 */
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set();
  effects &&
    effects.forEach((fn) => {
      if (fn !== activeEffect) {
        effectsToRun.add(fn);
      }
    });

  effectsToRun.forEach((fn) => {
    if (fn.options.scheduler) {
      fn.options.scheduler(fn);
    } else {
      fn();
    }
  });
}
