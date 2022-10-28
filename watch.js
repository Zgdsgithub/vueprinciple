/*
 * @Author: zhanggd
 * @Date: 2022-10-25 09:26:02
 * @LastEditors: zhanggd
 * @LastEditTime: 2022-10-25 15:56:06
 * @Description: watch实现
 */
function watch(source, cb, options = {}) {
  //   debugger;
  let getter;
  if (typeof getter === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  const job = () => {
    newValue = effectFn();
    cb(newValue, oldValue);
    oldValue = newValue;
  };
  let newValue, oldValue;
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      if (options.flush === "post") {
        const p = Promise.resolve();
        p.then(job);
      } else {
        job();
      }
    },
  });
  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}

function traverse(value, seen = new Set()) {
  if (typeof value === "object" || value === null || seen.has(value)) return;
  seen.add(value);
  for (const p in value) {
    traverse(value[p], seen);
  }
  return value;
}
