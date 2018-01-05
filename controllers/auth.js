const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = (authService, config) => {

    router.post('/login', (req, res) => {
        authService.login(req.body)
            .then((data) => {
                let token = jwt.sign({
                    __user_id: data.id,
                    __user_firstname: data.firstname
                }, 'ENG1996');
                res.cookie('x-access-token', token);
                res.json({success: "login success"});
            })
            .catch((err) => res.error(err));

    });

    router.post('/register', (req, res) => {
        res.header('Content-Type', 'application/json');
        authService.register(req.body)
            .then((user) => {
                res.json({success: "user was registered"});
            })
            .catch((error) => {
                res.json(error);
            });
    });


    router.get('/getname', (req, res) => {
        authService.getFirstname(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((error) => res.json(error));

    });

    router.post('/getpermissions', (req, res) => {
        authService.checkPermissions(req.body/*, req.cookies['x-access-token']*/)
            .then((result) => res.json(result))
            .catch((error) => res.json(error));

    });

    router.get('/getpermissionsadmin', (req, res) => {
        authService.checkPermissionsAdmin(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((error) => res.json(error));

    });

    router.get('/countusers', (req, res) => {
        authService.countUsers(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((error) => res.json(error));

    });

    router.get('/logout', (req, res) => {
        res.cookie('x-access-token', '');
        res.redirect("/index.html")
    });

    router.get('/getallusers', (req, res) => {
        authService.getAllUsers(req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));
    });

    router.delete('/deluser', (req, res) => {
        authService.delUser(req.body, req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));
    });

    router.post('/updateuser', (req, res) => {
        authService.updateUser(req.body, req.cookies['x-access-token'])
            .then((result) => res.json(result))
            .catch((err) => res.json(err));
    });

    router.get('/firststartapp', (req, res) => {
        authService.firstStartApp()
            .then((result) => res.json(result))
            .catch((err) => res.json(err));
    });

    return router;
};