const myMap = L.map('weatherMap').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(myMap);

getData();
async function getData(){
    const response = await fetch('/api');
    const data = await response.json();

    for (item of data){
        let marker = L.marker([parseFloat(item.lat), parseFloat(item.lon)]).addTo(myMap);
        let date = new Date(item.timeStamp);
        let tooltip = `Location: ${item.loc}.<br>` + 
                      `Temperature: ${item.temp}&degC.<br>` + 
                      `Humidity: ${item.hum}%.<br>` + 
                      `Conditions: ${item.cond}.<br>` + 
                      `Pollution: ${item.pollut}μg/m<sup>3</sup>.<br>` + 
                      `Timestamp: ${date.toLocaleString()}.`; 
        marker.bindPopup(tooltip);
    }
    console.log(data);
}
