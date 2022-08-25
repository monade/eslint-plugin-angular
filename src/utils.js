module.exports = {
  getDecoratorName(decorator) {
    return decorator?.expression?.callee?.name || decorator?.expression?.name;
  }
}
