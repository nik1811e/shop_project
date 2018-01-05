global.isProd = process.env.type === "prod";
module.exports = (Sequelize, config) => {
    const options = {
        host: isProd ? config.db_heroku.host : config.db.host,
        dialect: isProd ? config.db_heroku.dialect : config.db.dialect,
        logging: false,
        port: isProd ? config.db_heroku.port : config.db.port
    };
    const sequelize = new Sequelize(
        isProd ? config.db_heroku.name : config.db.name,
        isProd ? config.db_heroku.user : config.db.user,
        isProd ? config.db_heroku.password : config.db.password,
        options);


    const Auth = require('../model/auth')(Sequelize, sequelize);
    const Items = require('../model/items')(Sequelize, sequelize);
    const Orders = require('../model/orders')(Sequelize, sequelize);

    Orders.belongsTo(Auth);
    Auth.hasMany(Orders);
    Orders.belongsTo(Items);
    Items.hasMany(Orders);


    return {
        auth: Auth,
        items: Items,
        orders: Orders,
        sequelize: sequelize
    };
};