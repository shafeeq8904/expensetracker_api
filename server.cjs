const express = require('express')
const  bodyparser = require('body-parser')
const {ObjectId} = require('mongodb')
const cors= require('cors')

// Importing the required functions from dbconnection.cjs
const {connecttodb, getdb} = require('./dbconnection.cjs')

const app = express()
app.use(cors({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
}))
app.use(bodyparser.json())

connecttodb(function(error){
    if(error){
        console.log('heyy')
        console.log(error)
    }else{
        const port = process.env.PORT || 8000
        app.listen(port)
        db = getdb()
        console.log('listening on port ${port}...')
    }
    
})




app.post('/add-entry',function(request,response){
    db.collection('expensedata').insertMany(request.body).then(function(){
        response.status(201).json({
            "status":"entry added successfully"
        })
    }).catch(function(){
        response.status(500).json({
            "status":"entry did not add"
        })
    })


})

// get the entries 

app.get('/get-entries', function(request,response){
    const entries=[]
    db.collection('expensedata')
    .find()
    .forEach(entry => entries.push(entry))
    .then(function(){
        response.json(entries)
    }).catch(function(){
        console.log('cannot get files')
        response.json({
            'status':'cannot get successfully'
        })
    })
})


// delete entry using object id
//-------------------------------------------------------------------------
// app.delete('/delete-entry',function(request,response){
//     db.collection('expensedata').deleteOne({
//         _id:  new ObjectId('65c0b566cb5e374e4f6e6cb0')
//     }).then(function(){
//         response.status(201).json({
//             'status':'entry has been deleted'
//         })
//     }).catch(function(){
//         response.status(500).json({
//             'status':'entry has not been deleted'
//         })
//     })
// })


// delete entry using query

app.delete('/delete-entry', function(request, response) {
    if(ObjectId.isValid(request.query.id)) {
        db.collection('expensedata').deleteOne({
            _id : new ObjectId(request.query.id)
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})

//update a query

app.patch('/update-entry/:id', function(request, response) {
    if(ObjectId.isValid(request.params.id)) {
        db.collection('expensedata').updateOne(
            { _id : new ObjectId(request.params.id) }, // identifier : selecting the document which we are going to update
            { $set : request.body } // The data to be updated
        ).then(function() {
            response.status(200).json({
                "status" : "Entry updated successfully"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Unsuccessful on updating the entry"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})
