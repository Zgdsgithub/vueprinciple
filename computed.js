/*
 * @Author: zhanggd
 * @Date: 2022-10-24 17:01:30
 * @LastEditors: zhanggd
 * @LastEditTime: 2022-10-24 17:42:25
 * @Description: 计算属性
 */
function computed(getter) {
  let value;
  let dirty = true;
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        trigger(obj, "value");
      }
    },
  });

  const objc = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      track(obj, "value");
      return value;
    },
  };
  return objc;
}
