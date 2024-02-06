//this file is to connect with database mongodb
const {MongoClient} = require('mongodb')   //
let dataconnect

//this function is to connect with the database
// client - this is a default function which is used to connect with the specific database, now we dont want to return connection we want the database
function connecttodb(callback)
{
        MongoClient.connect('mongodb+srv://SHAFEEQ_AHMED:shafeeq8904@cluster0.syrgiep.mongodb.net/expensetracker?retryWrites=true&w=majority').then(function(client){
        dataconnect = client.db()   //
        callback()
    }).catch(function(error) {
        callback(error)
    })

}

// this function is to get the data from that specific database
function getdb(){
    return dataconnect

}
// // Exporting the required functions in server.cjs
module.exports ={connecttodb,getdb}