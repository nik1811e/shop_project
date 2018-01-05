"use strict";

const bcrypt = require('bcryptjs');
let Promise = require("bluebird");
const jwt = require('jsonwebtoken');
const saltRounds = 10;

module.exports = (userRepository, orderRepository, errors) => {
    return {
        login: login,
        register: register,
        getFirstname: getFirstname,
        checkPermissions: checkPermissions,
        checkPermissionsAdmin: checkPermissionsAdmin,
        countUsers: countUsers,
        getAllUsers: getAllUsers,
        delUser: delUser,
        updateUser: updateUser,
        firstStartApp: firstStartApp
    };

    function login(data) {
        return new Promise((resolve, reject) => {
            userRepository.findOne({
                where: {email: data.email},
                attributes: ['id', 'firstname', 'password']
            })
                .then((user) => {
                    if (data.email === "")
                        reject(errors.Unauthorized);
                    else {
                        bcrypt.compare(data.password.toString(), user.password.toString())
                            .then((result) => {
                                if (result === true)
                                    resolve(user);
                                else {
                                    reject(errors.wrongCredentials);
                                }
                            })
                            .catch(() => reject(errors.wrongCredentials));
                    }
                })
                .catch(() => reject(errors));

        });
    }

    function register(data) {
        return new Promise((resolve, reject) => {
            userRepository.count({where: [{email: data.email}]})
                .then((count) => {
                    if (count > 0)
                        return reject({"error": "email in db"});
                    else {
                        if (data.password !== "") {
                            bcrypt.hash(data.password.toString(), saltRounds, (err, hash) => {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    let user = {
                                        email: data.email,
                                        password: hash,
                                        firstname: data.firstname,
                                        lastname: data.lastname,
                                        permissions: "user"
                                    };
                                    Promise.all([userRepository.create(user)])
                                        .then(() => resolve({success: true}))
                                        .catch(() => reject({"error": "Somethings is wrong..."}));
                                }
                            });
                        }
                        else
                            reject(errors.wrongCredentials);
                    }
                })
        })
    }

    function getFirstname(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err)
                    return reject(err);
                else {
                    return resolve(decode.__user_firstname);
                }
            });
        });
    }

    function checkPermissions(data) {
        return new Promise((resolve, reject) => {
            userRepository.find({
                where: {email: data.email},
                attributes: ['permissions']
            })
                .then((result) => {
                    resolve(result.permissions);
                })
                .catch(() => reject(errors.notFound));
        });
    }

    function checkPermissionsAdmin(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err) {
                    return reject("err");
                } else {
                    userRepository.find({
                        where: {id: decode.__user_id},
                        attributes: ['permissions']
                    })
                        .then((result) => {
                            return resolve(result.permissions);
                        })
                        .catch(() => reject(errors.notFound));
                }
            });
        })
    }

    function countUsers(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err) {
                    return reject(err);
                } else {
                    userRepository.find({
                        where: {id: decode.__user_id},
                        attributes: ['permissions']
                    })
                        .then((result) => {
                            if (result.permissions === "admin") {
                                userRepository.count({})
                                    .then((resultUR) => {
                                        resolve(resultUR);
                                    })
                                    .catch(() => reject("access denied."))
                            }
                            else
                                reject("access denied.");
                        })
                        .catch(() => reject(errors.notFound));
                }
            });
        })
    }

    function getAllUsers(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err)
                    return reject(err);
                else {
                    userRepository.find({
                        where: {id: decode.__user_id},
                        attributes: ['permissions']
                    })
                        .then((result) => {
                            if (result.permissions === "admin") {
                                userRepository.findAll({
                                    where: {},
                                    attributes: ['email', 'firstname', 'lastname', 'permissions']
                                })
                                    .then((resultFR) => {
                                        resolve(resultFR);
                                    })
                                    .catch(() => {
                                        reject(errors.notFound);
                                    });
                            }
                        })
                        .catch(() => reject(errors.notFound));
                }
            });
        })
    }

    function delUser(data, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err)
                    return reject(err);
                else {
                    userRepository.find({
                        where: {id: decode.__user_id},
                        attributes: ['permissions']
                    })
                        .then((result) => {
                            if (result.permissions === "admin") {
                                if (data.email !== "") {
                                    userRepository.findOne({
                                        where: {email: data.email},
                                        attributes: ['id']
                                    })
                                        .then((resultUR) => {
                                            if (resultUR.id !== decode.__user_id) {
                                                orderRepository.destroy({
                                                    where: {authId: resultUR.id}
                                                });
                                                userRepository.destroy({
                                                    where: {email: data.email}
                                                });
                                                resolve("success");
                                            }
                                            else
                                                reject("access denied.");
                                        })
                                        .catch(() => reject("Error"));
                                }
                                else
                                    reject(errors.invalidId);
                            }
                            else
                                reject("access denied.");
                        })
                        .catch(() => reject("access denied."));
                }
            });
        })
    }

    function updateUser(data, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err)
                    return reject(err);
                else {
                    userRepository.find({
                        where: {id: decode.__user_id},
                        attributes: ['permissions']
                    })
                        .then((result) => {
                            if (result.permissions === "admin") {
                                if (data.email !== "") {
                                    userRepository.findOne({
                                        where: {email: data.email},
                                        attributes: ['id', 'permissions']
                                    })
                                        .then((resultUR) => {
                                            if (resultUR.id !== decode.__user_id) {
                                                if (resultUR.permissions === "admin") {
                                                    userRepository.update({
                                                        permissions: "user"
                                                    }, {
                                                        where: {email: data.email}
                                                    });
                                                    resolve("Success");
                                                }
                                                else {
                                                    userRepository.update({
                                                        permissions: "admin"
                                                    }, {
                                                        where: {email: data.email}
                                                    });
                                                    resolve("Success");
                                                }
                                            }
                                            else
                                                reject("access denied.");
                                        })
                                        .catch(() => reject("Error"));
                                }
                                else
                                    reject(errors.invalidId);
                            }
                            else
                                reject("access denied.");
                        })
                        .catch(() => reject("access denied."));
                }
            });
        })
    }

    function firstStartApp() {
        return new Promise((resolve, reject) => {
            userRepository.count()
                .then((count) => {
                    if (count === 0) {
                        bcrypt.hash("12345678", saltRounds, (err, hash) => {
                            if (err) {
                                throw err;
                            }
                            else {
                                let user = {
                                    email: "admin@admin.com",
                                    password: hash,
                                    firstname: "admin",
                                    lastname: "admin",
                                    permissions: "admin"
                                };
                                Promise.all([userRepository.create(user)])
                                    .then(() => resolve({success: true}))
                                    .catch(() => reject({"error": "Somethings is wrong..."}));
                            }
                        })
                    }
                    else {
                        reject(alert("Error: count != 0"));
                    }
                })
                .catch(() => reject({"error": "Somethings is wrong..."}));
        });
    }
};