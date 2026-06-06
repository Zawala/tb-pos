/* TbPos — mock retail catalog & data. Attaches to window.TB. */
(function () {
  // Soft tile color per category (used for the product image placeholder tiles)
  const CATS = [
    { id: 'all', name: 'All Items', icon: 'grid', hue: 220 },
    { id: 'drinks', name: 'Drinks', icon: 'cup', hue: 200 },
    { id: 'bakery', name: 'Bakery', icon: 'bread', hue: 32 },
    { id: 'produce', name: 'Produce', icon: 'leaf', hue: 140 },
    { id: 'dairy', name: 'Dairy', icon: 'milk', hue: 210 },
    { id: 'snacks', name: 'Snacks', icon: 'snack', hue: 350 },
    { id: 'household', name: 'Household', icon: 'home', hue: 270 },
    { id: 'personal', name: 'Personal', icon: 'heart', hue: 320 },
  ];

  // name, price, cat, sku, stock
  const P = [
    ['Cold Brew Coffee 330ml', 3.5, 'drinks', '8901001', 42],
    ['Sparkling Water 500ml', 1.8, 'drinks', '8901002', 120],
    ['Orange Juice 1L', 4.2, 'drinks', '8901003', 28],
    ['Green Tea 24pk', 6.9, 'drinks', '8901004', 16],
    ['Energy Drink 250ml', 2.4, 'drinks', '8901005', 0],
    ['Almond Milk 1L', 3.1, 'drinks', '8901006', 19],

    ['Sourdough Loaf', 4.5, 'bakery', '8902001', 14],
    ['Butter Croissant', 2.2, 'bakery', '8902002', 30],
    ['Blueberry Muffin', 2.8, 'bakery', '8902003', 22],
    ['Cinnamon Bagel 4pk', 3.9, 'bakery', '8902004', 8],
    ['Chocolate Chip Cookie', 1.5, 'bakery', '8902005', 64],

    ['Bananas (per kg)', 1.2, 'produce', '8903001', 55],
    ['Avocado', 1.1, 'produce', '8903002', 40],
    ['Roma Tomato (per kg)', 2.3, 'produce', '8903003', 33],
    ['Baby Spinach 200g', 2.6, 'produce', '8903004', 12],
    ['Red Apple (per kg)', 2.1, 'produce', '8903005', 47],

    ['Whole Milk 2L', 2.9, 'dairy', '8904001', 36],
    ['Greek Yogurt 500g', 3.4, 'dairy', '8904002', 24],
    ['Cheddar Block 250g', 4.8, 'dairy', '8904003', 18],
    ['Free-Range Eggs 12', 4.1, 'dairy', '8904004', 9],
    ['Salted Butter 200g', 3.2, 'dairy', '8904005', 27],

    ['Sea Salt Chips 150g', 2.5, 'snacks', '8905001', 58],
    ['Dark Chocolate 90g', 3.3, 'snacks', '8905002', 41],
    ['Mixed Nuts 200g', 5.6, 'snacks', '8905003', 15],
    ['Pretzel Sticks 250g', 2.1, 'snacks', '8905004', 33],
    ['Granola Bar 6pk', 4.4, 'snacks', '8905005', 21],

    ['Dish Soap 500ml', 2.7, 'household', '8906001', 26],
    ['Paper Towels 4pk', 5.2, 'household', '8906002', 17],
    ['Trash Bags 30ct', 4.9, 'household', '8906003', 11],
    ['Laundry Pods 16ct', 8.4, 'household', '8906004', 6],

    ['Toothpaste 100ml', 3.6, 'personal', '8907001', 29],
    ['Hand Soap 250ml', 2.9, 'personal', '8907002', 23],
    ['Shampoo 400ml', 5.8, 'personal', '8907003', 13],
    ['Lip Balm', 1.9, 'personal', '8907004', 48],
  ];

  const products = P.map((r, i) => ({
    id: 'p' + (i + 1),
    name: r[0],
    price: r[1],
    cat: r[2],
    sku: r[3],
    stock: r[4],
  }));

  const catHue = Object.fromEntries(CATS.map(c => [c.id, c.hue]));
  const catName = Object.fromEntries(CATS.map(c => [c.id, c.name]));

  // recent orders
  const names = [
    'Walk-in',
    'Walk-in',
    'Maya Chen',
    'Walk-in',
    'Diego Ruiz',
    'Walk-in',
    'Aisha Khan',
    'Walk-in',
    'Tom Becker',
    'Walk-in',
    'Nina Park',
    'Walk-in',
  ];
  const pays = ['Card', 'Cash', 'QR', 'Card', 'Card', 'Cash', 'QR', 'Card', 'Cash', 'Card', 'QR', 'Card'];
  const orders = Array.from({ length: 12 }, (_, i) => {
    const lines = 1 + Math.floor(Math.random() * 5);
    const items = Array.from({ length: lines }, () => {
      const p = products[Math.floor(Math.random() * products.length)];
      return { name: p.name, qty: 1 + Math.floor(Math.random() * 3), price: p.price };
    });
    const sub = items.reduce((s, it) => s + it.qty * it.price, 0);
    const tax = sub * 0.08;
    const mins = i * 17 + 4;
    return {
      id: 'TB-' + (10472 - i),
      customer: names[i],
      pay: pays[i],
      items,
      count: items.reduce((s, it) => s + it.qty, 0),
      subtotal: sub,
      tax,
      total: sub + tax,
      status: i === 0 ? 'Completed' : i === 3 ? 'Refunded' : 'Completed',
      ago: mins < 60 ? mins + 'm ago' : Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm ago',
      time: new Date(Date.now() - mins * 60000),
    };
  });

  // hourly sales for dashboard sparkline/bars (10:00 → 19:00)
  const hours = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
  const sales = [320, 540, 880, 1240, 760, 690, 910, 1180, 1460, 980];

  const topProducts = [
    { name: 'Cold Brew Coffee 330ml', units: 84, revenue: 294 },
    { name: 'Butter Croissant', units: 71, revenue: 156.2 },
    { name: 'Sea Salt Chips 150g', units: 63, revenue: 157.5 },
    { name: 'Whole Milk 2L', units: 58, revenue: 168.2 },
    { name: 'Sourdough Loaf', units: 49, revenue: 220.5 },
  ];

  window.TB = {
    CATS,
    products,
    orders,
    catHue,
    catName,
    hours,
    sales,
    topProducts,
    money: n => '$' + n.toFixed(2),
    store: { name: 'TbPos', branch: 'Downtown · Register 1', cashier: 'Alex Rivera', taxRate: 0.08 },
  };
})();
