import InvalidApiToken from "../errors/invalidApiToken.js";

export function verifyToken(req, res, next) {
  const token = process.env.token || "t0k3n";

  if (req.query.apiToken !== token) {
    const error = new InvalidApiToken();

    throw new Error(error.message);
  }

  next();
}