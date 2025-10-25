/*
 data-store.js
 เก็บ data structures กลาง: users, products, orders พร้อม index และ aggregates
*/
let users = [];
let products = [];
let orders = [];

let userOrderMap = new Map(); // userId -> [orders]
let userAggMap = new Map();   // userId -> { count, total }

function resetStores() {
  users = [];
  products = [];
  orders = [];
  userOrderMap = new Map();
  userAggMap = new Map();
}

module.exports = {
  users, products, orders, userOrderMap, userAggMap, resetStores
};
