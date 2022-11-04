/*
 * @Author: zhanggd
 * @Date: 2022-10-31 14:06:10
 * @LastEditors: zhanggd
 * @LastEditTime: 2022-10-31 16:08:48
 * @Description: refs
 */
function ref(val) {
  const wrapper = {
    value: val,
  };
  Object.defineProperty(wrapper, "_v_isRef", {
    value: true,
  });
  return reactive(wrapper);
}
