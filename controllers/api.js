const express = require('express');
const router = express.Router();

module.exports = (authService,menuService,orderService, config) => {
    const authController = require('./auth')(authService, config);
    const menuController = require ('./menu')(menuService,config);
    const orderController = require ('./order')(orderService,config);


    router.use ('/menu',menuController);
    router.use('/auth', authController);
    router.use('/order', orderController);
    return router;
};

