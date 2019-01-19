const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp', (err, client) => {
    if (err) {
        console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp')

    //findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({/**Filter Argument */
    //     _id: new ObjectID('5c3fb1e046b3cfc3cf0928af')
    // }, {/*Operator Arg*/
    //     $set: {completed: true}
    // }, {/**Options Arg */
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c3f839f4569611a6c9179b4')
    }, {
        $set: {name: 'Trideep'},
        // $inc: {age: +1}
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    client.close();
});
