var NewsManager = function(selector, subject, template, topSelector){

    var self = this;

    this._viewSelector = selector;
    this._subject = subject;
    this._apiKey = "83f3de70585c472caad609a6812a2e17";
    this._newsData = [];
    this._topStories = [];
    this._template = template;
    this._topSelector = topSelector;
    this._domainsToAvoid = [
        ".ru",
        ".tk",
        ".es",
        ".in",
    ]

    var init = function(manager){
        manager.LoadTopStories(function(){
            manager.InitializeTemplates(self._topStories, self._template, self._topSelector, 5)
        });
    };

    init(self);

    $('.search-subject').on('click', function(){
        self.LoadNews(function(){
            debugger;
            self.InitializeTemplates(self._newsData, self._template, self._viewSelector);
        });
    });
}

NewsManager.prototype = {
    //clé api :   83f3de70585c472caad609a6812a2e17
    /*
        Il faudrait quand même trouver un meilleur API parce que les résultats sont vachement aléatoires et il n'est pas possible de choisir un pays source
        du coup il faut faire un tri à la main    
    */

    LoadNews: function(callback){

        var self = this;
        debugger;
        $.ajax({
            url: 'https://newsapi.org/v2/everything?q=' + self._subject + '&sortBy=publishedAt&apiKey=' + this._apiKey,
            method: "GET",
            error: function(error){
                console.log(error);
            },
            complete: function(data){
                newsData = [];
                for(var i = 0; i < 10; i++){
                    newsData.push(data.responseJSON.articles[i]);
                }
                self._newsData = newsData;
                callback();
            }
        });
    },

    InitializeTemplates: function(data, template, insertSelector, value){
        insertSelector.empty();

        if (i== 4)
            insertSelector.append('</br>');

        for(var i = 0; i < value; i++){
            var imageUrl = data[i].urlToImage;
            var title = data[i].title;
            var date = data[i].publishedAt.substr(0, 10);
            var description = data[i].description;
            var urlSource = data[i].url;
            var source = data[i].source.name;

            var mustacheVar = {
                "imageUrl": imageUrl,
                "title": title,
                "date": date,
                "source": source,
                "description": description,
                "urlSource": urlSource
            };
            var rendered = Mustache.render(template.html(), mustacheVar);
            insertSelector.append(rendered);
        }
    },

    LoadTopStories: function(callback){
        var self = this;

        $.ajax({
            url: 'https://newsapi.org/v2/top-headlines?sources=google-news-fr&apiKey=' + this._apiKey,
            method: 'GET',
            error: function(error){
                console.log(error);
            },
            complete: function(data){
                stories = [];
                for(var i = 0; i < 6; i++){
                    stories.push(data.responseJSON.articles[i]);
                }
                self._topStories = stories;
                callback();
            }
        });
    }
}



