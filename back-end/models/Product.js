const { ObjectID } = require("bson");

const getAll = (conn) => () => conn.collection('products').find().toArray();

const updateCurrentAuction = (conn) => (id) => conn.collection('products').
    updateOne(
      { _id: ObjectID(id) },
      { $inc: { currentAuction: 10 } },
    );

const getById = (conn) => (id) => conn.collection('products').findOne(ObjectID(id));

module.exports = {
  getAll,
  getById,
  updateCurrentAuction,
}