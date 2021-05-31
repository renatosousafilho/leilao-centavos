const { MongoClient } = require('mongodb');

module.exports = async () => {
  connection = await MongoClient.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = connection.db(process.env.DB_NAME);
  await db.collection('participants').deleteMany({});
  await db.collection('participants').insertMany([
    {
      name: 'Tanjiro Kamado',
      image: 'https://i.pinimg.com/originals/3f/b9/76/3fb976d3ce6f8a993f01da944c71cf41.jpg',
      votes: 0,
    },
    {
      name: 'Nezuko Kamado',
      image: 'https://i.pinimg.com/originals/89/f6/2a/89f62aeb5b2c134b5c592e2023a283da.jpg',
      votes: 0,
    },
    {
      name: 'Inosuke Hashibira',
      image: 'https://sketchok.com/images/articles/06-anime/026-demon-slayer/03/16.jpg',
      votes: 0,
    }
  ]);
}