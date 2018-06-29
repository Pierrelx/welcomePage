var WeatherManager = function (rouenTableSelector, havreTableSelector, template){

    var self = this; 

    this._rouenWeatherData = [];
    this._havreWeatherData = [];
    this._rouenTableSelector = rouenTableSelector;
    this._havreTableSelector = havreTableSelector;
    this._currentComparisonDate = moment().format('YYYY-MM-DD');
    this._afterComparisonDate = moment().add(1, 'days').format('YYYY-MM-DD');
    this._leHavre = "Le Havre";
    this._rouen = "Rouen";
    this._template = template;

    var init = function(manager){
        manager.LoadWeatherData(self._rouen, function(){
            manager.SetUpWeatherTables(self._rouenWeatherData, self._rouenTableSelector);
        });
        manager.LoadWeatherData(self._leHavre, function(){
            manager.SetUpWeatherTables(self._havreWeatherData, self._havreTableSelector);
        });

    };


    init(self);
}

WeatherManager.prototype = {

    //Permet de charger les données météo pour une ville donnée
    LoadWeatherData: function(city, callback){

        var self = this;

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q="+ city + ",fr&mode=json&appid=db8469307ef6946bebcee3833c4cb6b1",
            method: "GET", 
            error: function(error){
                console.log(error);
            },
            complete: function(data){                
                var dataToUse = [];

                for(var i = 0; i < data.responseJSON.list.length; i++){
                    var dateToUse = data.responseJSON.list[i].dt_txt.substring(0,10);
                    if( dateToUse === self._currentComparisonDate || dateToUse === self._afterComparisonDate){
                        dataToUse.push(data.responseJSON.list[i]);
                    }   
                    else{
                        break;
                    }                 
                }
                if(city === self._leHavre){
                    self._havreWeatherData = dataToUse;
                    console.log(self._havreWeatherData);}
                else if(city === self._rouen){
                    self._rouenWeatherData = dataToUse;
                    console.log(self._rouenWeatherData)}

                callback();
            }
        });
    },

    //Met en place le DOM pour l'affichage de la météo pour une ville donnée
    SetUpWeatherTables: function(cityData, citySelector){
        var self = this;

        for(var i = 0; i < 10; i++){
            var time = cityData[i].dt_txt.substr(10, 3) + "h";
            var tempKelv = parseFloat(cityData[i].main.temp);
            var tempCelc = Math.round(Math.abs(tempKelv - 273,15));
            var cloudiness = cityData[i].clouds.all;
            var weatherCond = cityData[i].weather[0].id;
            var conditions = self.GetsIconAndConditions(weatherCond);
            var mustacheVar = {
                "date": "",
                "heure": time,
                "temperature": tempCelc,
                "cloudiness": cloudiness,
                "conditions": conditions.cond,
                "imageUrl": conditions.pic 
            }; 
            var rendered = Mustache.render($('.weather-template').html(), mustacheVar);
            citySelector.append(rendered);
        }
    }, 

    //Retourne les conditions météorologiques selon un id
    //Retourne un objet {cond: string, pic: string}
    GetsIconAndConditions: function(weatherId){
        switch(weatherId){
            case 200:
            case 201:
            case 202:
                return {cond: "Orage avec pluie", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 210:
            case 211:
            case 212:
            case 221:
                return {cond: "Orage", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 230:
            case 231: 
            case 232:
                return {cond: "Orage avec grêle", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 300:
            case 301:
            case 302:
            case 310:
            case 311:
                return {cond: "Crachin", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 312:
            case 313:
            case 314:
            case 321:
            case 500:
            case 520:
                return {cond: "Légère pluie", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 501:
                return {cond: "Pluie modérée", pic: "http://openweathermap.org/img/w/10d.png"};
                break;
            case 502:
            case 503:
            case 504:
            case 521:
            case 522:
            case 531:
                return {cond: "Fortes pluies", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 511:
                return {cond: "Pluie froide", pic: "http://openweathermap.org/img/w/09d.png"};
                break;  
            case 600:
            case 601:
            case 602:
            case 611:
            case 612:
            case 615:
            case 616:
            case 620:
            case 621:
            case 622:
                return {cond: "Neige", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 701:
            case 711:
            case 721:
            case 731:
            case 741:
            case 751:
            case 761:
            case 762:
            case 771:
            case 781:
                return {cond: "Brume/Brouillard", pic: "http://openweathermap.org/img/w/50d.png"};
                break;
            case 800:
                return {cond: "Ciel dégagé", pic: "http://openweathermap.org/img/w/01d.png"};
                break;
            case 801:
            case 802:
            case 803:
            case 804: 
                return {cond: "Nuageux", pic: "http://openweathermap.org/img/w/03d.png"};
                break;
            }
    },

}