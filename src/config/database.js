import { Sequelize } from 'sequelize';
import { env } from './env.js';

const commonOptions = {
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
};

export const sequelize = env.dbDialect === 'mysql'
  ? new Sequelize(env.dbName, env.dbUser, env.dbPassword, {
      host: env.dbHost,
      port: env.dbPort,
      dialect: 'mysql',
      ...commonOptions
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: env.sqliteStorage,
      ...commonOptions
    });
