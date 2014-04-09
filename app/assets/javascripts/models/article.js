var articles,
    map,
    geocoder,
    view,
    geoJson,
    pin;

WorldView.geoJson = [];
WorldView.placesCounter = 0;

var Article = Backbone.Model.extend({
  urlRoot: '/articles',

  initialize: function(){
    this.on('change:latlng', this.changeLatLng, this);
  },

  changeLatLng: function(){
    WorldView.geoJson.push(this.dropPin(this));
    if (WorldView.geoJson.length === WorldView.numberOfPlaces - 20) {
      view.pushIn(map, WorldView.geoJson);
    }
    //debugger;
  },

  dropPin: function(item){
    return {
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type: 'Feature',
    geometry: {
      type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats

        coordinates: [item.attributes.latlng[1] + Math.random(), item.attributes.latlng[0] + Math.random()]
      },
      properties: {
        title: item.attributes.title,
        description: '<a href='+ item.attributes.url +' target="_blank">'+item.attributes.abstract+'</a>',
        // one can customize markers by adding simplestyle properties
        // http://mapbox.com/developers/simplestyle/
        'marker-size': 'medium',
        'marker-symbol': item.pinStyle(item.attributes.section),
        'marker-color': "#000000"
      }
    };
  },

  pinStyle: function(section){
    var styleHash = {
      "Business Day": "mobilephone",
      "U.S.": "bank",
      "Science": "chemist",
      "World": "embassy"
    };

    return styleHash[section];
  },

});

var ArticleCollection = Backbone.Collection.extend({
  model: Article,
  url: '/articles'
});

var ArticleView = Backbone.View.extend({
  render: function(collection, view, callback){

    _.map(collection.models, function(elem){
      if(elem.attributes.geo_facet !== "" ){
        _.map(elem.attributes.geo_facet, function(place){
          WorldView.placesCounter++;
          geocoder.query(place, function(error, data){
            //console.log();
            elem.set("latlng", data.latlng);
            //pinData(view.dropPin(elem.attributes, view));
          });
        });
      }
    });
    WorldView.numberOfPlaces = WorldView.placesCounter;
    //debugger;
    //return view.pushIn(map, geoJson);
  },



  pushIn: function(map, geoJson){
   return map.featureLayer.setGeoJSON(geoJson)
 },

 initialize: function(){
  //geoJson = new Array;
  geocoder = L.mapbox.geocoder('zstayman.hn1a3ih4');
    // this.render(this.collection, this);
  }
});



$(document).ready(function(){
  map = L.mapbox.map('map', 'zstayman.hn1a3ih4').setView([30,0], 2);
  $.getJSON("/articles", function(json){
    articles = new ArticleCollection(json.response);
    view = new ArticleView({collection: articles});
    view.render(view.collection, view, view.pushIn);
  });
});



