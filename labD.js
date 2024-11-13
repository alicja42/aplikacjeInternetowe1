document.getElementById('szukaj').addEventListener('click', function(){
    const city=document.getElementById('search').value;
    if(!city){
        alert("Podaj miasto");
        return;
    }

    document.getElementById('pogoda').innerHTML='';

    const apiKey='d78529415fda3ba888929ff347cfda80';

    const currentWeatherUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    const xhr=new XMLHttpRequest();
    console.log(currentWeatherUrl);
    xhr.open('GET', currentWeatherUrl, true);
    xhr.onload=function(){
        if (xhr.status===200){
            const weatherData=JSON.parse(xhr.responseText);
            console.log(weatherData);
            displayCurrentWeather(weatherData);
        } else{
            alert("Nie udało się pobrać pogody");
        }
    };
    xhr.send();

    const forecastUrl=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    console.log(forecastUrl);
    fetch(forecastUrl)
        .then(response=>{
            if(!response.ok)throw new Error("Nie udało się pobrać pogody");
            return response.json();
        })
        .then(forecastData =>{
            console.log(forecastData);
            displayWeatherForecast(forecastData);
        })
        .catch(error=>alert(error.message));
});

function displayCurrentWeather(data){
    const weatherElement=document.getElementById('pogoda');
    const currentWeather=document.createElement('li');
    const iconUrl=`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const roundedTemp=Math.round(data.main.temp);

    currentWeather.innerHTML=`
        <h3>Aktualna Pogoda</h3>
        <img src="${iconUrl}" alt="Ikonka pogody"/>
        <p>${roundedTemp}°C</p>
        <p>${data.weather[0].description}</p>
    `;
    weatherElement.appendChild(currentWeather);
}

function displayWeatherForecast(data){
    const weatherElement=document.getElementById('pogoda');
    const forecastHeader=document.createElement('li');
    forecastHeader.innerHTML=`<h3>Prognoza na 5 dni</h3>`;
    weatherElement.appendChild(forecastHeader);

    data.list.forEach(forecast=>{
        const forecastItem=document.createElement('li');
        const iconUrl=`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
        const dateTime=forecast.dt_txt.split(" ");
        const date=dateTime[0];
        const time=dateTime[1].slice(0, 5);

        forecastItem.innerHTML=`
            <img src="${iconUrl}" alt="Ikonka pogody" />
            <p><strong>${date} ${time}</strong></p>
            <p>${Math.round(forecast.main.temp)}°C</p>
            <p>${forecast.weather[0].description}</p>
        `;
        weatherElement.appendChild(forecastItem);
    });
}
