const siege = require("siege");

siege()
    .on(3000)
    .for(10000).times
    .get('http://localhost:3000/api/menu/getallmenu')
    .attack();

// siege()
//     .on(3000)
//     .for(10000).times
//     .get('http://localhost:3000/base.html')
//     .attack();

// siege()
//     .on(3000)
//     .for(10000).times
//     .get('/orders/pay')
//     .attack();


/*
 * node index.js
 * node tests/siege
 * ----------------------
 * pm2 start index
 * node test
 * pm2 stop index
 * */