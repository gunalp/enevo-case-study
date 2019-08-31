var dotenv = require('dotenv');
dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case 'development':
    path = `${__dirname}/.env.development`;
    break;
  case 'production':
    path = `${__dirname}/.env.production`;
    break;
  default:
    path = `${__dirname}/.env.development`;
}
dotenv.config({ path });