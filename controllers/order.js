const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = (orderService) => {

    router.post('/tocart', (req, res) => {
        orderService.addToCart(req.body, req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    router.get('/countcart', (req, res) => {
        orderService.countCart(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    router.get('/totalcart', (req, res) => {
        orderService.totalCart(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));
    });

    router.get('/historyorder', (req, res) => {
        orderService.historyOrder(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));
    });

    router.get('/itemcart', (req, res) => {
        orderService.getItemCart(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));
    });

    router.post('/delallfromcart', (req, res) => {
        orderService.delAllFromCart(req.body, req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    router.post('/delonefromcart', (req, res) => {
        orderService.delOneFromCart(req.body, req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    router.get('/pay', (req, res) => {
        orderService.pay(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    router.get('/countorders', (req, res) => {
        orderService.countOrders(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    router.get('/totalallorders', (req, res) => {
        orderService.totalAllOrders(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    return router;
};
