module.exports = (Sequelize, sequelize) => {
    return sequelize.define('orders', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_order: Sequelize.INTEGER,
        date_order: Sequelize.STRING,
        status: Sequelize.STRING,
        count: Sequelize.INTEGER
    });
};