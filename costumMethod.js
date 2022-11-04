/*
 * @Author: zhanggd
 * @Date: 2022-10-31 10:41:43
 * @LastEditors: zhanggd
 * @LastEditTime: 2022-10-31 14:06:34
 * @Description: 自定义拦截方法
 */
const mutableInstrumentations = {
  get(key) {
    const target = this.raw;
    const had = target.has(key);
    track(target, key);
    if (!had) {
      const res = target.get(key);
      return typeof res === "object" ? reactive(res) : res;
    }
  },
  set(key, value) {
    const target = this.raw;
    const had = target.has(key);
    const oldValue = target.get(key);
    const rowValue = value.raw || value;
    target.set(key, rowValue);
    if (!had) {
      trigger(target, key, "ADD");
    } else if (
      oldValue !== value ||
      (oldValue === oldValue && value === value)
    ) {
      trigger(target, key, "SET");
    }
  },
  add(key) {
    const target = this.raw;
    const res = target.add(key);
    const hasKey = target.has(key);
    if (!hasKey) {
      trigger(target, key, "ADD");
    }
    return res;
  },
  delete(key) {
    const target = this.raw;
    const hasKey = target.has(key);
    const res = target.delete(key);
    if (hasKey) {
      trigger(target, key, "DELETE");
    }
    return res;
  },
};
