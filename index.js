const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();
// console.log(process.env);

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.post('/api', (request, response) => {
    console.log('I got a request!');
    const data = request.body;
    const timeStamp = Date.now();
    data.timeStamp = timeStamp;

    database.insert(data);

    response.json({
        status: 'success',
        data: request.body
    });
});

app.get('/api', (request, response) => {
    database.find({}).sort({ timestamp: 1 }).exec((err, data) => {
        if(err){
            response.end();
            return;
        }
        response.json(data);
    })
});

app.get('/link/:latlon', async (request, response) => {
    console.log(request.params);
    const parameters = request.params.latlon.split(',');
    const lat = parameters[0];
    const lon = parameters[1];
    
    const api_key = process.env.API_KEY;
   
    const api_weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const weather_respond = await fetch(api_weather_url);
    const weather_data = await weather_respond.json();
    
    const api_air_url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const air_respond = await fetch(api_air_url);
    const air_data = await air_respond.json();

    const data = {
        weather: weather_data,
        air: air_data
    }
    console.log(data);
    response.json(data);
})
