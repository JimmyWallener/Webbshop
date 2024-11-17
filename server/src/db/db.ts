import mysql, { ConnectionOptions } from 'mysql2';

const config: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
};

const conn = mysql.createConnection(config);

export default conn.promise();
