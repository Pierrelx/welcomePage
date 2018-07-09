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
    this._apiKey = "db8469307ef6946bebcee3833c4cb6b1";

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
    //Clé API:  db8469307ef6946bebcee3833c4cb6b1
    LoadWeatherData: function(city, callback){

        var self = this;

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?q="+ city + ",fr&mode=json&appid=" + this._apiKey,
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
                    self._havreWeatherData = dataToUse;}
                else if(city === self._rouen){
                    self._rouenWeatherData = dataToUse;}

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
    //Il faudrait essayer de trouver de meilleurs icônes et détailler les conditions
    GetsIconAndConditions: function(weatherId){
        switch(weatherId){
            case 200:
                return {cond: "Orage avec pluie légère", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 201:
                return {cond: "Orage avec pluie", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 202:
                return {cond: "Orage avec forte pluie", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 210:
                return {cond: "Orage léger", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 211:
                return {cond: "Orage", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 212:
                return {cond: "Gros orage", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 221:
                return {cond: "Orage avec tempête", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 230:
                return {cond: "Tempête avec grêlons légers", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            case 231:
                return {cond: "Orage avec grêlons", pic: "http://openweathermap.org/img/w/11d.png"};
                break; 
            case 232:
                return {cond: "Orage avec gros grêlons", pic: "http://openweathermap.org/img/w/11d.png"};
                break;
            //Bruine, pas pluie !!
            case 300:
                return {cond: "Bruine très fine", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 301:
                return {cond: "Bruine fine", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 302:
                return {cond: "Bruine fine intense", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 310:
                return {cond: "Bruine fine et pluie légère", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 311:
                return {cond: "Pluie et bruine", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 312:
                return {cond: "Crachin intense", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 313:
                return {cond: "Pluie et crachin", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 314:
                return {cond: "Grosse pluie et crachin", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 321:
                return {cond: "Crachin intense", pic: "http://openweathermap.org/img/w/09d.png"};
                break;

            case 500:
                return {cond: "Légère pluie", pic: "http://openweathermap.org/img/w/10d.png"};
                break;
            case 501:
                return {cond: "Pluie modérée", pic: "http://openweathermap.org/img/w/10d.png"};
                break;
            case 502:
                return {cond: "Pluie intense", pic: "http://openweathermap.org/img/w/10d.png"};
                break;
            case 503:
                return {cond: "Forte pluie", pic: "http://openweathermap.org/img/w/10.png"};
                break;
            case 504:
                return {cond: "Pluie extrême", pic: "http://openweathermap.org/img/w/10d.png"};
                break;
            case 511:
                return {cond: "Pluie froide", pic: "http://openweathermap.org/img/w/13d.png"};
                break; 
            case 520:
                return {cond: "Légère pluie", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 521:
                return {cond: "Pluie", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 522:
                return {cond: "Pluie intense", pic: "http://openweathermap.org/img/w/09d.png"};
                break;
            case 531:
                return {cond: "Fortes pluies", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
             
            case 600:
                return {cond: "Neige légère", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 601:
                return {cond: "Neige", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 602:
                return {cond: "Forte neige", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 611:
                return {cond: "Neige fondue", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 612:
                return {cond: "Neige fondue", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 615:
                return {cond: "Pluie légère et neige", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 616:
                return {cond: "Pluie et neige", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 620:
                return {cond: "Neige légère", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 621:
                return {cond: "Neige", pic: "http://openweathermap.org/img/w/13d.png"};
                break;
            case 622:
                return {cond: "Forte neige", pic: "http://openweathermap.org/img/w/13d.png"};
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