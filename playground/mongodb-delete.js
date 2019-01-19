const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, client) => {
    if (err) {
        console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp')

    //deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat food'}).then((result) => {
    //     console.log(result); 
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat Food'}).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result); 
    // });

    db.collection('todos').deleteMany({text: 'Teest'}).then((result) => {
        console.log(result); 
    });

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5c3f7e601dbe59090c573e39')}).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    });

    client.close();
});
