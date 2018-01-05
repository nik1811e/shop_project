"use strict";
const jwt = require('jsonwebtoken');

const regNumbers = /\d+/;
const regLiteral = /\D+/;

let idFood = 0;

module.exports = (foodRepository, userRepository, orderRepository, errors) => {
    return {
        getMenu: getMenu,
        addFood: addFood,
        delFood: delFood,
        getAllMenu: getAllMenu,
        countAllMenu: countAllMenu,
        updateFood: updateFood,
        getIdFood: getIdFood
    };

    function getMenu(data) {
        return new Promise((resolve, reject) => {
            foodRepository.findAll({
                where: {type_food: data.type_food},
                attributes: ['name', 'price']
            })
                .then((resultFR) => {
                    resolve(resultFR);
                })
                .catch(() => {
                    reject(errors.notFound);
                });
        })
    }

    function getAllMenu(token) {
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
                                foodRepository.findAll({
                                    where: {},
                                    attributes: ['name', 'price', 'type_food']
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

    function countAllMenu(token) {
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
                                foodRepository.count({
                                    where: {},
                                })
                                    .then((resultFR) => {
                                        resolve(resultFR);
                                    })
                                    .catch(() => reject("access denied."))
                            }
                            else
                                reject("access denied.");
                        })
                        .catch(() => reject(errors.notFound));
                }
            });
        });
    }

    /*admin page*/
    function addFood(data, token) {
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
                                    if (data.name !== "" && data.price !== "" && data.type_food !== "") {
                                        if (!regNumbers.test(data.name.toString()) && !regLiteral.test(data.price)) {
                                            foodRepository.count({where: {name: data.name}})
                                                .then((count) => {
                                                    if (!count > 0) {
                                                        let food = {
                                                            "name": data.name,
                                                            "price": data.price,
                                                            "type_food": data.type_food
                                                        };
                                                        Promise.all([foodRepository.create(food)])
                                                            .then(() => resolve({"success": "Food was added."}))
                                                            .catch(() => reject());

                                                    }
                                                    else {
                                                        console.log("error: food in db");
                                                        return reject({"error": "food in db"});
                                                    }
                                                })
                                                .catch(() => reject(errors.notFound));
                                        }
                                        else
                                            reject({"error": "Not correctly input"});
                                    }
                                    else
                                        reject(errors.Unauthorized);
                                }
                                else
                                    reject("access denied.");
                            })
                            .catch(() => reject(errors.notFound));
                    }
                });
            }
        );
    }

    function delFood(data, token) {
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
                                if (data.name !== "") {
                                    foodRepository.findOne({
                                        where: {name: data.name},
                                        attributes: ['id']
                                    })
                                        .then((resultFR) => {
                                            orderRepository.destroy({
                                                where: {itemId: resultFR.id}
                                            });
                                            foodRepository.destroy(({
                                                where: {name: data.name}
                                            }));
                                        })
                                        .catch(() => reject("access denied."));
                                    return resolve({"success": "Food was delete."});
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

    function getIdFood(data) {
        return new Promise((resolve, reject) => {
            foodRepository.find({
                where: {name: data.name},
                attributes: ['id']
            })
                .then((resultFR) => {
                    idFood = resultFR.id;
                    console.log("id food: " + idFood);
                    resolve(resultFR.id);
                })
                .catch(() => reject(errors.notFound));
        });
    }

    function updateFood(data, token) {
        getIdFood(data);
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
                                if (data.name !== "" && data.price !== "" && data.type_food !== "") {
                                    if (!regNumbers.test(data.name.toString()) && !regLiteral.test(data.price)) {
                                        foodRepository.update({
                                            name: data.name,
                                            price: data.price,
                                            type_food: data.type_food
                                        }, {
                                            where: {id: idFood}
                                        });
                                        resolve("Success");
                                    }
                                    else
                                        reject({"error": "Not correctly input"});
                                }
                                else
                                    reject(errors.Unauthorized);
                            }
                            else
                                reject("access denied.");
                        })
                        .catch(() => reject(errors.notFound));
                }
            });
        });
    }
}
;