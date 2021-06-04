if('geolocation' in navigator){
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
    // console.log(position);
    const lat = position.coords.latitude;
    document.getElementById('latitude').textContent = lat.toFixed(4);
    const lon = position.coords.longitude;
    document.getElementById('longitude').textContent = lon.toFixed(4);
    
    const weather_conditions = await fetch(`/link/${lat},${lon}`);
    const weather_conditions_response = await weather_conditions.json();
    console.log(weather_conditions_response);
    
    // WEATHER INFORMATION
    
    document.querySelector('#location').innerHTML = weather_conditions_response.weather.name;
    document.querySelector('#current-temp').innerHTML = (Number(weather_conditions_response.weather.main.temp) - 273.15).toFixed(2);
    document.querySelector('#current-humidity').innerHTML = weather_conditions_response.weather.main.humidity;
    document.querySelector('#current-pressure').innerHTML = weather_conditions_response.weather.main.pressure;
    document.querySelector('#feels-like').innerHTML = (Number(weather_conditions_response.weather.main.feels_like) - 273.15).toFixed(2);
    let cond = '';
    weather_conditions_response.weather.weather.forEach((element, index) => {
        if (index > 0){
            cond += '<br>'
        }
        cond += element.description;
    });
    document.querySelector('#conditions').innerHTML = cond;
    
    // AIR POLLUTION INFORMATION

    document.querySelector('#concentration-co').innerHTML = weather_conditions_response.air.list[0].components.co;
    document.querySelector('#concentration-nh3').innerHTML = weather_conditions_response.air.list[0].components.nh3;
    document.querySelector('#concentration-no').innerHTML = weather_conditions_response.air.list[0].components.no;
    document.querySelector('#concentration-no2').innerHTML = weather_conditions_response.air.list[0].components.no2;
    document.querySelector('#concentration-o3').innerHTML = weather_conditions_response.air.list[0].components.o3;
    document.querySelector('#concentration-pm25').innerHTML = weather_conditions_response.air.list[0].components.pm2_5;
    document.querySelector('#concentration-pm10').innerHTML = weather_conditions_response.air.list[0].components.pm10;
    document.querySelector('#concentration-so2').innerHTML = weather_conditions_response.air.list[0].components.so2;
    });

    const sendData = async function(){

        const lat = document.getElementById('latitude').innerHTML;
        const lon = document.getElementById('longitude').innerHTML;
        const loc = document.querySelector('#location').innerHTML;
        const temp = document.querySelector('#current-temp').innerHTML;
        const hum = document.querySelector('#current-humidity').innerHTML;
        const cond = document.querySelector('#conditions').innerHTML;
        const pollut = 
            (parseFloat(document.querySelector('#concentration-co').innerHTML) +     
            parseFloat(document.querySelector('#concentration-nh3').innerHTML) +     
            parseFloat(document.querySelector('#concentration-no').innerHTML) +     
            parseFloat(document.querySelector('#concentration-no2').innerHTML) +     
            parseFloat(document.querySelector('#concentration-o3').innerHTML) +     
            parseFloat(document.querySelector('#concentration-pm25').innerHTML) +     
            parseFloat(document.querySelector('#concentration-pm10').innerHTML) +     
            parseFloat(document.querySelector('#concentration-so2').innerHTML)).toFixed(2);  
        
        toBeSent = {
            lat, 
            lon,
            loc,
            temp,
            hum,
            cond,
            pollut
        };       
        const options = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(toBeSent)
        }
        const response = await fetch('/api', options)
        const json = await response.json();
        console.log(json);
        };
        document.querySelector('#send-coordinates').onclick = sendData;
}