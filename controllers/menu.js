const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = (menuService) => {
    router.post('/add', (req, res) => {
        menuService.add(req.body)
            .then((data) => res.redirect("/main.html"))
            .catch((err) => res.error(err));
    });

    router.get('/del/:id', (req, res) => {
        menuService.del(req.params.id)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => res.error(err));

    });

    router.post('/getmenu', (req, res) => {
        menuService.getMenu(req.body)
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    router.get('/countmenu', (req, res) => {
        menuService.countAllMenu(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    router.get('/getallmenu', (req, res) => {
        menuService.getAllMenu(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    /*ADMIN PAGE*/

    router.post('/addfood', (req, res) => {
        menuService.addFood(req.body, req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    router.delete('/delFood', (req, res) => {
        menuService.delFood(req.body, req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));
    });

    router.post('/updatefood', (req, res) => {
        menuService.updateFood(req.body, req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    router.post('/getidfood', (req, res) => {
        menuService.getIdFood(req.body)
            .then((result) => res.json(result))
            .catch((err) => res.json(err));

    });

    return router;
};