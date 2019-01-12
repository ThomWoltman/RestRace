const express = require('express');
const app = express();

const productiontUrl = 'mongodb://'+process.env.MONGODB_USERNAME+':'+process.env.MONGODB_PASSWORD+'@cluster0-shard-00-00-rkeks.mongodb.net:27017,cluster0-shard-00-01-rkeks.mongodb.net:27017,cluster0-shard-00-02-rkeks.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
const developmentUrl = 'mongodb://localhost:27017/restrace';
const url = app.get('env') === 'development' ? developmentUrl : productiontUrl;

module.exports = {
    url
};