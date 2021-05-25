// app.ts
import express from 'express';
import path from 'path';
const pushDataToKafka = require('./kafka-producer');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const PORT = 8080;
const HOST = '0.0.0.0';

app.get('/', (req, res) => {
  res.send('The server is working!');
});

// Add Orders
app.post('/orders', async (req, res) => {
    try{
        const date_str = new Date()
        var jsonObject = req.body.orders[0]
        
        const result1 = await pushDataToKafka("orders", jsonObject.trackingNumber, jsonObject)

        const result2 = await pushDataToKafka("orders-ordertime", jsonObject.trackingNumber, {
            "trackingNumber": jsonObject.trackingNumber,
            "orderTime": date_str
        })
        
        const result3 = await pushDataToKafka("orders-op", jsonObject.trackingNumber, {
            "trackingNumber": jsonObject.trackingNumber,
            "lastUpdateTime": date_str,
            "op":"c" 
        })
        
        const successfulRes = {
            "statusCode": "2000",
            "object": {},
            "message": "successfully Insert orders",
            "errorMessage": null
        }
        
        await res.send('POST /orders, Add orders: ' + JSON.stringify(successfulRes));
    }
    catch(error){
        console.log(error)
        
        const failRes = {
            "statusCode": "4010",
            "object": {},
            "message": "wrong API Key, or country not supported",
            "errorMessage": null
        }
        
        res.status(401).send('POST /orders, Add orders: ' + JSON.stringify(failRes));
    }
})

//Update Orders
app.patch('/orders', async (req, res) => {
    try{
        const date_str = new Date()
        var jsonObject = req.body.orders[0]
        
        const result1 = await pushDataToKafka("orders", jsonObject.trackingNumber, jsonObject)

        const result2 = await pushDataToKafka("orders-op", jsonObject.trackingNumber, {
            "trackingNumber": jsonObject.trackingNumber,
            "lastUpdateTime": date_str,
            "op":"u" 
        })
        
        const successfulRes = {
            "statusCode": "2000",
            "object": {},
            "message": "successfully update orders",
            "errorMessage": null
        }
        
        res.send('patch /orders Update orders: ' + JSON.stringify(successfulRes));
    }catch(error){
        const failRes = {
            "statusCode": "4010",
            "object": {},
            "message": "wrong API Key, or country not supported",
            "errorMessage": null
        }
        
        res.status(401).send('POST /orders, Update orders: ' + JSON.stringify(failRes));
    }
})

app.delete('/orders', async (req, res) => {
    try{
        const date_str = new Date()
        const trackingNumber = req.body.trackingNumbers[0]
        const result1 = await pushDataToKafka("orders-op", trackingNumber, {
            "trackingNumber": trackingNumber,
            "lastUpdateTime": date_str,
            "op":"d" 
        })
        
        const successfulRes = {
            "statusCode": "2000",
            "object": {},
            "message": "successfully delete orders",
            "errorMessage": null
        }
        
        res.send('delete /orders Delete orders: ' + JSON.stringify(successfulRes));
    
    }catch(error){
        console.log(error)
        
        const failRes = {
            "statusCode": "4010",
            "object": {},
            "message": "",
            "errorMessage": null
        }
        
        res.status(401).send('DELETE /orders, Delete orders: ' + JSON.stringify(failRes));
    }
})

app.post('/orders/statuses', async (req, res) => {
    try{
        var jsonObject = req.body.statuses[0]
        
        const result = await pushDataToKafka("orders-statuses", jsonObject.trackingNumber, jsonObject)
        
        const successfulRes = {
            "statusCode": "2000",
            "object": {},
            "message": "successfully update order statuses",
            "errorMessage": null
        }
    
        res.send('POST /orders/statuses Add orders statuses: ' + JSON.stringify(successfulRes));
    }
    catch(error){
        console.log(error)
        
        const failRes = {
            "statusCode": "4010",
            "object": {},
            "message": "",
            "errorMessage": null
        }
        
        res.status(401).send('POST /orders/statuses Add orders statuses: ' + JSON.stringify(failRes));
    }
})

// ================================================

app.post('/trucks/locations', async (req, res) => {
    
     try{
         var jsonObject = req.body.locations[0]
        
        const result = await pushDataToKafka("trucks-locations", jsonObject.truckNumber, jsonObject)
        
        
        const successfulRes = {
            "statusCode": "2000",
            "object": {},
            "message": "successfully update order statuses",
            "errorMessage": null
        }
    
        res.send('post /trucks/locations Add or Update Truck locations: ' + JSON.stringify(successfulRes));
    }
    catch(error){
        console.log(error)
        
        const failRes = {
            "statusCode": "4010",
            "object": {},
            "message": "",
            "errorMessage": null
        }
        
        res.status(401).send('POST /orders/statuses Add orders statuses: ' + JSON.stringify(failRes));
    }
})

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);

module.exports = app;