class CustomAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = "Not Authenticated Error";
  }
}

module.exports = CustomAuthError;
