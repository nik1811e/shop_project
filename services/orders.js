"use strict";
const jwt = require('jsonwebtoken');

const statusWait = "wait";
const statusPaid = "paid";

module.exports = (orderRepository, foodRepository, userRepository, errors) => {
    return {
        addToCart: addToCart,
        countCart: countCart,
        totalCart: totalCart,
        historyOrder: historyOrder,
        getItemCart: getItemCart,
        delAllFromCart: delAllFromCart,
        delOneFromCart: delOneFromCart,
        pay: pay,
        countOrders: countOrders,
        totalAllOrders: totalAllOrders
    };

    function addToCart(data, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err)
                    return reject(err);
                else {
                    foodRepository.findOne({
                        where: {name: data.name},
                        attributes: ['id']
                    })
                        .then((resultFR) => {
                            orderRepository.findOne({
                                where: {
                                    authId: decode.__user_id,
                                    itemId: resultFR.id,
                                    status: statusWait
                                },
                                attributes: ['count', 'authId', 'itemId']
                            })
                                .then((resultOR) => {
                                    if (resultOR.itemId === resultFR.id) {
                                        let tmpCount = resultOR.count + 1;
                                        orderRepository.update({count: tmpCount}, {
                                            where: {
                                                itemId: resultFR.id,
                                                authId: decode.__user_id,
                                                status: statusWait
                                            }
                                        });
                                        tmpCount = 0;
                                    }
                                    else {
                                        let order = {
                                            "itemId": resultFR.id,
                                            "authId": decode.__user_id,
                                            "count": 1,
                                            "status": statusWait
                                        };
                                        Promise.all([orderRepository.create(order)])
                                            .then(() => resolve({success: "ok, success"}))
                                            .catch(() => reject({error: "item wasn't add to cart..."}));
                                    }
                                    resolve({success: true});
                                })
                                .catch(() => {
                                    let order = {
                                        "itemId": resultFR.id,
                                        "authId": decode.__user_id,
                                        "count": 1,
                                        "status": statusWait
                                    };
                                    Promise.all([orderRepository.create(order)])
                                        .then(() => resolve({success: "ok, success"}))
                                        .catch(() => reject({error: "item wasn't add to cart..."}));
                                })
                        })
                        .catch(() => reject(errors.notFound));

                }
            });
        });
    }

    function countCart(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err)
                    return reject(err);
                else {
                    orderRepository.findAll({
                        where: {authId: decode.__user_id, status: statusWait},
                        attributes: ['count']
                    })
                        .then((resultOR) => {
                            let count = 0;
                            for (let i = 0; i < resultOR.length; i++) {
                                count += resultOR[i].count;
                            }
                            resolve(count);
                        })
                        .catch(() => reject(errors.notFound))
                }
            });
        })
    }

    function totalCart(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err)
                    return reject(err);
                else {
                    orderRepository.findAll({
                        where: {authId: decode.__user_id, status: statusWait},
                        attributes: ['itemId', 'count'],
                        include: {
                            model: foodRepository,
                            attributes: ['price']
                        },
                    })
                        .then((result) => {
                            let total = 0;
                            for (let i = 0; i < result.length; i++) {
                                total += result[i].count * result[i].item.price;
                            }
                            resolve(total);
                        })
                        .catch(() => reject(errors.notFound))
                }
            });
        })
    }

    function historyOrder(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err)
                    return reject(err);
                else {
                    orderRepository.findAll({
                        where: {authId: decode.__user_id, status: statusPaid},
                        attributes: ['itemId', 'count', 'date_order', 'id_order'],
                        include: {
                            model: foodRepository,
                            attributes: ['name', 'price']
                        },
                    })
                        .then((result) => {
                            let resJson = [];
                            for (let i = 0; i < result.length; i++) {
                                let tmp = {
                                    id_order: result[i].id_order,
                                    name: result[i].item.name,
                                    price: result[i].item.price,
                                    count: result[i].count,
                                    date_order: result[i].date_order
                                };
                                resJson.push(tmp)
                            }
                            resolve(resJson);
                        })
                        .catch(() => reject(errors.notFound))
                }
            });
        })
    }

    function getItemCart(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err)
                    return reject(err);
                else {
                    orderRepository.findAll({
                        where: {authId: decode.__user_id, status: statusWait},
                        attributes: ['itemId', 'count'],
                        include: {
                            model: foodRepository,
                            attributes: ['name', 'price']
                        },
                    })
                        .then((result) => {
                            let resJson = [];
                            for (let i = 0; i < result.length; i++) {
                                let tmp = {
                                    name: result[i].item.name,
                                    price: result[i].item.price,
                                    count: result[i].count
                                };
                                resJson.push(tmp)
                            }
                            resolve(resJson);
                        })
                        .catch(() => reject(errors.notFound))
                }
            });
        })
    }

    function delAllFromCart(data, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err) {
                    reject(errors.unauthorized);
                } else {
                    foodRepository.findOne({
                        where: {name: data.name},
                        attributes: ['id']
                    })
                        .then((resultFR) => {
                            orderRepository.destroy({
                                where: {authId: decode.__user_id, itemId: resultFR.id}
                            })
                                .then((resultOR) => {
                                    // resolve(resultOR);
                                    resolve({"success": "delete all item."})
                                })
                                .catch(() => reject(errors.notFound));
                        })
                        .catch(() => reject(errors.notFound));
                }
            })
        })
    }

    function delOneFromCart(data, token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err) {
                    reject(errors.unauthorized);
                } else {
                    foodRepository.findOne({
                        where: {name: data.name},
                        attributes: ['id']
                    })
                        .then((resultFR) => {
                            orderRepository.findOne({
                                where: {authId: decode.__user_id, itemId: resultFR.id},
                                attributes: ['count']
                            })
                                .then((resultOR) => {
                                    if (resultOR.count === 1) {
                                        orderRepository.destroy({
                                            where: {authId: decode.__user_id, itemId: resultFR.id}
                                        })
                                            .then((resultOR) => {
                                                // resolve(resultOR);
                                                resolve({"success": "delete one item."})
                                            })
                                            .catch(() => reject(errors.notFound));
                                    }
                                    else {
                                        let tmpCount = resultOR.count - 1;
                                        orderRepository.update({count: tmpCount}, {
                                            where: {
                                                authId: decode.__user_id,
                                                itemId: resultFR.id
                                            }
                                        });
                                        tmpCount = 0;
                                        resolve({"success": "delete one item."})
                                    }
                                })
                                .catch(() => reject(errors.notFound));
                        })
                        .catch(() => reject(errors.notFound));
                }
            })
        })
    }

    function pay(token) {
        const date = new Date();
        let dateNow = date.getDate() +
            "." + (date.getMonth() + 1) +
            "." + date.getFullYear();
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'ENG1996', (err, decode) => {
                if (err) {
                    reject(err);
                } else {
                    orderRepository.count({
                        where: {authId: decode.__user_id, status: statusWait},
                    })
                        .then((resultOR) => {
                            if (resultOR === 0) {
                                reject(errors.notFound);
                            }
                            else {
                                orderRepository.max('id_order', {})
                                    .then((resultIO) => {
                                        let tmpIdOrder = 0;
                                        if (isNaN(resultIO)) {
                                            tmpIdOrder = 1;
                                            orderRepository.update({
                                                status: statusPaid,
                                                date_order: dateNow,
                                                id_order: tmpIdOrder
                                            }, {
                                                where: {
                                                    authId: decode.__user_id,
                                                    status: statusWait
                                                }
                                            });
                                            tmpIdOrder = 0;
                                            resolve({"success": "Pay success!"})
                                        }
                                        else {
                                            tmpIdOrder = resultIO + 1;
                                            orderRepository.update({
                                                status: statusPaid,
                                                date_order: dateNow,
                                                id_order: tmpIdOrder
                                            }, {
                                                where: {
                                                    authId: decode.__user_id,
                                                    status: statusWait
                                                }
                                            });
                                            tmpIdOrder = 0;
                                            resolve({"success": "Pay success!"})
                                        }
                                    })
                                    .catch(() => reject(errors.notFound));
                            }
                        })
                        .catch(() => reject(errors.notFound));
                }
            })
        })
    }

    function countOrders(token) {
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
                                orderRepository.max('id_order', {})
                                    .then((resultIO) => {
                                        resolve(resultIO);
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

    function totalAllOrders(token) {
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
                                orderRepository.findAll({
                                    where: {status: statusPaid},
                                    attributes: ['itemId', 'count'],
                                    include: {
                                        model: foodRepository,
                                        attributes: ['price']
                                    },
                                })
                                    .then((result) => {
                                        let total = 0;
                                        for (let i = 0; i < result.length; i++) {
                                            total += result[i].count * result[i].item.price;
                                        }
                                        resolve(total);
                                    })
                                    .catch(() => reject(errors.notFound))
                            }
                            else
                                reject("access denied.");
                        })
                        .catch(() => reject("access denied."));
                }
            });
        })
    }
};
