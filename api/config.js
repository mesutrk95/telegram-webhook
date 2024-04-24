const config = {};

module.exports = {
  set(name, value) {
    config[name] = value;
  },

  get(name) {
    return config[name];
  },
};
