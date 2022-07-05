function convterJsonToFromData(data, keys, buffer) {
  if (buffer == null) {
    buffer = [];
  }
  const type = (typeof data);
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const newKeys = keys ? (keys + "[" + i + "]") : "[" + i + "]";
      convterJsonToFromData(data[i], newKeys, buffer);
    }
  } else if ("object" === type) {
    for (const key in data) {
      const newKeys = keys ? keys + "." + key : key;
      convterJsonToFromData(data[key], newKeys, buffer)
    }
  } else {
    buffer.push(keys + "=" + encodeURIComponent(data));
  }
  return buffer.join("&");
}

export default convterJsonToFromData;
