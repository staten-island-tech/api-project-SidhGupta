/* const products = [ */
/*     { id: 1, name: 'Laptop', category: 'Electronics', price: "899.99" },
    { id: 2, name: 'Shoes', category: 'Fashion', price: "49.99" },
    { id: 3, name: 'Smartphone', category: 'Electronics', price: "699.99" },
    { id: 4, name: 'Jacket', category: 'Fashion', price: "99.99" },
    { id: 5, name: 'Headphones', category: 'Electronics', price: "199.99" }
];

// 1. Use `filter` to get all products in the "Electronics" category
const electronics = products.filter(product => product.category === 'Electronics');
console.log('Electronics:', electronics);

// 2. Use `forEach` to log the names of all products
console.log('All Product Names:');
products.forEach(product => console.log(product.name));

// 3. Use `includes` to check if any product name contains "Shoes"
const hasShoes = products.some(product => product.name.includes('Shoes'));
console.log('Is there a product with "Shoes"?', hasShoes);

// 4. Combine `filter` and `forEach`: Get all products priced over $100 and log their names
const expensiveProducts = products.filter(product => product.price > 300);
console.log('Expensive Products:');
expensiveProducts.forEach(product => console.log(product.name));
 */