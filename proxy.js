/*
 * @Author: zhanggd
 * @Date: 2022-10-18 13:48:57
 * @LastEditors: zhanggd
 * @LastEditTime: 2022-10-28 15:41:50
 * @Description: 响应式数据获取与设置
 */
function createReactive(data, isShallow = false, isReadonly = false) {
  return new Proxy(data, {
    get(target, key, receiver) {
      if (key === "raw") {
        return target;
      }
      if (!isReadonly && typeof key !== "symbol") {
        track(target, key);
      }
      const res = Reflect.get(target, key, receiver); // 使this指向代理对象
      if (isShallow) {
        return res;
      }
      // 将res包装成响应式数据
      if (typeof res === "Object" && res !== null) {
        return isReadonly ? readonly(res) : reactive(res);
      }
      return res;
    },
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`);
        return true;
      }
      const oldVal = target[key];
      console.log("旧值", oldVal);
      console.log("获取到新值", newVal);
      const type = Array.isArray(target)
        ? Number(key) < target.length
          ? "SET"
          : "ADD"
        : Object.prototype.hasOwnProperty.call(target, key)
        ? "SET"
        : "ADD";
      const res = Reflect.set(target, key, newVal, receiver);
      if (target === receiver.raw) {
        // 确保old与new都不是NaN
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          trigger(target, key, type, newVal);
        }
      }
      return res;
    },
    ownKeys(target) {
      track(target, Array.isArray(target) ? "length" : ITERATE_KEY);
      return Reflect.ownKeys(target);
    },
  });
}
const reactiveMap = new Map();
// 深响应
function reactive(data) {
  // 避免重复创建代理对象,有代理对象时不会创建新的代理对象
  const existionProxy = reactiveMap.get(data); //是否存在代理对象
  if (existionProxy) return existionProxy;
  const proxy = createReactive(data);
  reactiveMap.set(data, proxy);
  return proxy;
}
// 浅响应
function shallowReactive(data) {
  return createReactive(data, true);
}
// 只读（依然可以修改深层属性）
function readonly(data) {
  return createReactive(data, false, true);
}
// 浅只读
function shallowReadonly(data) {
  return createReactive(data, true, true);
}
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

function trigger(target, key, type, newVal) {
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
  if (type === "ADD" || type === "DELETE") {
    const iterateEffects = depsMap.get(ITERATE_KEY);
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        if (effectFn !== activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }
  if (Array.isArray(target) && key === "length") {
    depsMap.forEach((effects, key) => {
      if (key >= newVal) {
        effects.forEach((effectFn) => {
          if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn);
          }
        });
      }
    });
  }
  effectsToRun.forEach((fn) => {
    if (fn.options.scheduler) {
      fn.options.scheduler(fn);
    } else {
      fn();
    }
  });
}
