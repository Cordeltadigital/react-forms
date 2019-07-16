export function keyPath (path, target) {
  if (!target) return;
  var index = path.indexOf('.');
  return index === -1
      ? target[path]
      : keyPath(path.substring(index + 1), target[path.substring(0, index)]);
};

keyPath.set = function (path, target, value) {
  if (!target) return;
  var index = path.indexOf('.');
  if(index === -1)
      target[path] = value;
  else {
      var targetProperty = path.substring(0, index),
          remainder = path.substring(index + 1),
          targetObject = target[targetProperty];

      if (!targetObject || typeof targetObject !== 'object') {
          targetObject = {};
          target[targetProperty] = targetObject;
      }

      keyPath.set(remainder, targetObject, value);
  }
  return target
}