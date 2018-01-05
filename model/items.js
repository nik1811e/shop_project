module.exports = (Sequelize, sequelize) => {
    return sequelize.define('items', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },


        name: Sequelize.STRING,
        price : Sequelize.INTEGER,
        type_food: Sequelize.STRING
    });
};