'use strict';
//npm i --g mocha
let auth = require('../controllers/auth');
let request = require('supertest')(auth);
let Sequelize = require('sequelize');
let sinon = require('sinon');
let should = require('should');

let errors = require('../utils/errors');

let config = require('../config');
let db = require('../context/db')(Sequelize, config);

let authRepository = db.auth;
let foodRepository = db.items;
let orderRepository = db.orders;

let authService = require('../services/auth')(authRepository);
let foodService = require('../services/menu')(foodRepository);
let orderService = require('../services/orders')(orderRepository);

let sandbox;

const user = {
    "email": "qwe@qwe.qwe",
    "password": "1234",
    "lastname": "qwe",
    "firstname": "qwe"
};

const userLogin = {
    "email": "qweeeeeeeeeeee@qwe.qwe",
    "password": "1234",
    "lastname": "qwe",
    "firstname": "qwe"
};

const food = {
    "name": "eeee",
    "price": "123",
    "type_food": "basemenu"
};

const foodDelete = {
    "name": "Takos"
};

const typeFood = "basemenu";
const nameFood = "qwe";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfX3VzZXJfaWQiOjMsIl9fdXNlcl9maXJzdG5hbWUiOiJOaWtpdGEiLCJpYXQiOjE0OTY1ODgwOTF9.4f3lhHv0ctWZKQI58kQb8vuCiYHq0xl-yvC0sOO0hxo";

beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

afterEach(() => {
    sandbox.restore();
});


describe('- Это тесты', () => {

    describe('- Auth тесты', () => {

        // describe('Регистрация пользователя: ', () => {
        //     it.only('Успех', () => {
        //         sandbox.stub(authRepository, 'create').returns(Promise.resolve(userLogin));
        //         let promise = authService.register(userLogin);
        //         return promise.then((res) => {
        //             res.should.be.an.Object();
        //         })
        //     });
        // });

        // describe('Авторизация пользователя: ', () => {
        //     it('Успех', () => {
        //         sandbox.stub(authRepository, 'create').returns(Promise.resolve(user));
        //         let promise = authService.login(user);
        //         return promise.then((res) => {
        //             res.should.be.an.Object();
        //         })
        //     });
        // });

        describe('Получить имя пользователя: ', () => {
            it('Успех', () => {
                sandbox.stub(authRepository, 'findOne').returns(Promise.resolve(user));
                let promise = authService.getFirstname(token);
                return promise.then((res) => {
                    res.should.be.an.String();
                })
            });
        });

        // describe('Получить группу пользователя: ', () => {
        //     it('Успех', () => {
        //         sandbox.stub(authRepository, 'findOne').returns(Promise.resolve(user));
        //         let promise = authService.checkPermissions(user);
        //         return promise.then((res) => {
        //             res.should.be.an.String();
        //         })
        //     });
        // });
        //
        // describe('Получить число пользователей: ', () => {
        //     it('Успех', () => {
        //         sandbox.stub(authRepository, 'findOne').returns(Promise.resolve(user));
        //         let promise = authService.countUsers(token);
        //         return promise.then((res) => {
        //             res.should.be.an.Number();
        //         })
        //     });
        // });
    });

    describe('- Food тесты', () => {
        describe('Получить меню по типу продукта: ', () => {
            it('Успех', () => {
                sandbox.stub(foodRepository, 'findAll').returns(Promise.resolve(typeFood));
                let promise = foodService.getMenu(typeFood);
                return promise.then((res) => {
                    res.should.be.an.String();
                })
            });
        });

        describe('Добавить продукт в меню: ', () => {
            it('Успех', () => {
                sandbox.stub(foodRepository, 'create').returns(Promise.resolve(food, token));
                let promise = foodService.addFood(food, token)
                    .then((res) => {
                        res.should.be.an.Object;
                    })
            });
        });

        describe('Удалить продукт из меню: ', () => {
            it('Успех', () => {
                sandbox.stub(foodRepository, 'destroy').returns(Promise.resolve(foodDelete));
                let promise = foodService.addFood(foodDelete)
                    .then((res) => {
                        res.should.be.an.json;
                    })
            });
        });

        describe('Получить всё меню: ', () => {
            it('Успех', () => {
                sandbox.stub(foodRepository, 'findAll').returns(Promise.resolve());
                let promise = foodService.getAllMenu()
                    .then((result) => {
                        result.should.be.an.json;
                    });
            });
        });

        describe('Получить количество пунктов меню: ', () => {
            it('Успех', () => {
                sandbox.stub(foodRepository, 'findOne').returns(Promise.resolve(token));
                let promise = foodService.countAllMenu(token)
                    .then((result) => {
                        result.should.be.an.Number;
                    });
            });
        });
    });

    describe('- Order тесты', () => {
        describe('Добавить продукт в корзину: ', () => {
            it('Успех', () => {
                sandbox.stub(orderRepository, 'create').returns(Promise.resolve(token));
                let promise = orderService.addToCart(nameFood, token)
                    .then((res) => {
                        res.should.be.an.json;
                    });
            });
        });

        describe('Количество продуктов в корзине: ', () => {
            it('Успех', () => {
                sandbox.stub(orderRepository, 'findAll').returns(Promise.resolve(token));
                let promise = orderService.countCart(token);
                return promise.then((res) => {
                    res.should.be.an.Number;
                })
            });
        });

        describe('Стоимость всех продуктов в корзине: ', () => {
            it('Успех', () => {
                sandbox.stub(orderRepository, 'findAll').returns(Promise.resolve(token));
                orderService.totalCart(token)
                    .then((res) => {
                        res.should.be.an.Number;
                    })
            });
        });

        // TODO: FIX
        // describe('История заказов: ', () => {
        //     it('Успех', () => {
        //         sandbox.stub(foodService, 'findOne').returns(Promise.resolve(token));
        //         orderService.historyOrder(token)
        //             .then((res) => {
        //                 res.should.be.an.json;
        //             })
        //     });
        // });
        //
        //     describe('Получить товары в корзине: ', () => {
        //         it('Успех', () => {
        //             sandbox.stub(orderRepository, 'findAll').returns(Promise.resolve());
        //             let promise = orderService.getItemCart(token1);
        //             return promise.then((res) => {
        //                 res.should.be.an.json;
        //             })
        //         });
        //     });
        //
        //     describe('Удалить товары из корзине: ', () => {
        //         it('Успех', () => {
        //             sandbox.stub(orderRepository, 'findOne').returns(Promise.resolve(food));
        //             let promise = orderService.delAllFromCart(food, token);
        //             return promise.then((res) => {
        //                 res.should.be.an.json;
        //             })
        //         });
        //     });
        //
        //     describe('Получить количество заказов: ', () => {
        //         it('Успех', () => {
        //             sandbox.stub(orderRepository, 'find').returns(Promise.resolve(token1));
        //             let promise = orderService.countOrders(token1);
        //             return promise.then((res) => {
        //                 res.should.be.an.Number();
        //             })
        //         });
        //     });
        //
        //     describe('Получить количество заказов: ', () => {
        //         it('Успех', () => {
        //             sandbox.stub(orderRepository, 'find').returns(Promise.resolve(token1));
        //             let promise = orderService.countOrders(token1);
        //             return promise.then((res) => {
        //                 res.should.be.an.Number();
        //             })
        //         });
        //     });
        // TODO: FIX
    });
});