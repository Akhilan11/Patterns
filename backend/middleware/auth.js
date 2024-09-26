const { expressjwt: jwt } = require("express-jwt");

const jwksRsa = require('jwks-rsa');

// JWT middleware configuration
const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    // Replace <YOUR_AUTH0_DOMAIN> with your actual Auth0 domain
    jwksUri: `https://<YOUR_AUTH0_DOMAIN>/.well-known/jwks.json`
  }),
  audience: '<YOUR_API_IDENTIFIER>', // Replace with your actual API Identifier
  issuer: `https://<YOUR_AUTH0_DOMAIN>/`, // Replace with your actual Auth0 domain
  algorithms: ['RS256']
});

// Export the middleware function
module.exports = jwtCheck;
