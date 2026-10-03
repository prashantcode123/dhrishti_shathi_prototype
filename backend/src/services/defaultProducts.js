export const PRODUCTS = [
  "Coca Cola 500ml",
  "Lays Classic",
  "Pepsi 500ml",
  "Parle-G",
  "Maggi Noodles",
  "Britannia Good Day",
  "Dairy Milk",
  "Kurkure",
];

// SHELF-01 gets the 1st product, SHELF-02 the 2nd, and it cycles
export const productForShelf = (index) => PRODUCTS[(index - 1) % PRODUCTS.length];