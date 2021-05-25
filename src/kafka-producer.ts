const { Kafka } = require('kafkajs');
const path = require('path');
require('dotenv').config()

const pushDataToKafka = async (kafkaTopic: string, messageKey: string, jsonObject: {}) => {
    
    console.log("process.env.API_SERVER_ID: " + process.env.API_SERVER_ID)
    console.log("process.env.KL_ECS_API_KEY: " + process.env.KL_ECS_API_KEY)
    console.log("process.env.KAFKA_BOOTSTRAP_SERVERS: " + process.env.KAFKA_BOOTSTRAP_SERVERS)
    
    const API_SERVER_ID = process.env.API_SERVER_ID
    const KAFKA_BOOTSTRAP_SERVERS = process.env.KAFKA_BOOTSTRAP_SERVERS ? process.env.KAFKA_BOOTSTRAP_SERVERS : ""
    
    try {
        const kafka = new Kafka({
            clientId: API_SERVER_ID,
            brokers: KAFKA_BOOTSTRAP_SERVERS.split(",")
        })

        const producer = kafka.producer();

        const payloadToKafkaTopic = {
            topic: kafkaTopic,
            messages:[{
                key: messageKey,
                value: JSON.stringify(jsonObject)
            }]
        };
        
        await producer.connect();
        const res = await producer.send(payloadToKafkaTopic);
        
        console.log("KAFKA Successful ->", res)
        return Promise.resolve(res)
    } catch (error) {
        console.log("KAFKA Error ->", error);
        return Promise.reject(error)
    }
};

module.exports = pushDataToKafka;