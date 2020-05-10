const { getDb, getNextSequence } = require('./db.js');

async function add(_, { product }) {
  const newProduct = Object.assign({}, product);
  const db = getDb();
  const count = await getNextSequence('products');
  newProduct.id = count;
  const result = await db.collection('products').insertOne(newProduct);
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

async function update(_, { id, modify }) {
  const db = getDb();
  await db.collection('products').updateOne({ id }, { $set: modify });
  const savedProduct = await db.collection('products').findOne({ id });
  return savedProduct;
}

async function list() {
  const db = getDb();
  const products = await db.collection('products').find({}).toArray();
  return products;
}

async function get(_, { id }) {
  const db = getDb();
  const product = await db.collection('products').findOne({ id });
  return product;
}

async function remove(_, { id }) {
  console.log('  Delete product ID: ', id);
  const db = getDb();
  const product = await db.collection('products').findOne({ id });
  if (!product) return false;
  await db.collection('products').removeOne({ id });
  return true;
}

async function counts() {
  const db = getDb();
  const results = await db.collection('products').aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]).toArray();
  return results[0]['count'];
}

module.exports = {
  list,
  add,
  get,
  update,
  remove,
  counts,
};
