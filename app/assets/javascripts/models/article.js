// variables
var articles,
    map,
    geocoder,
    view,
    geoJson,
    pin;

// set counters and holders
WorldView.geoJson = [];
WorldView.placesCounter = 0;

// Article Model
var Article = Backbone.Model.extend({
  urlRoot: '/articles',

// fires the change event to set LatLng
  initialize: function(){
    this.on('change:latlng', this.changeLatLng, this);
  },

// sets LatLng based on geocoder results and orders the map to render
  changeLatLng: function(){
    WorldView.geoJson.push(this.dropPin(this));
    // it takes too long to async, I need to call this later in the process
    if (WorldView.geoJson.length === WorldView.numberOfPlaces - 20) {
      console.log(WorldView.numberOfPlaces)
      view.pushIn(map, WorldView.geoJson);
    }
    //debugger;
  },

// creates the GeoJSON object
  dropPin: function(item){
    return {
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type: 'Feature',
    geometry: {
      type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats

        coordinates: [item.get("latlng")[1] + Math.random(), item.get("latlng")[0] + Math.random()]
      },
      properties: {
        title: item.attributes.title,
        description: '<a href='+ item.get("url") +' target="_blank">'+item.get("abstract")+'</a>',
        // one can customize markers by adding simplestyle properties
        // http://mapbox.com/developers/simplestyle/
        'marker-size': 'medium',
        'marker-symbol': item.pinStyle(item.get("section")),
        'marker-color': "#000000"
      }
    };
  },

// sets the icon on the pin
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

// defines the collection
var ArticleCollection = Backbone.Collection.extend({
  model: Article,
  url: '/articles'
});

// logic relating to the map
var ArticleView = Backbone.View.extend({
  // creates the GeoJSON objects
  render: function(collection, view, callback){

    _.map(collection.models, function(elem){
      if(elem.get("geo_facet") !== "" ){
        _.map(elem.attributes.geo_facet, function(place){
          WorldView.placesCounter++;
          console.log(WorldView.geoJson);
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


// adds pins to the map
  pushIn: function(map, geoJson){
   return map.featureLayer.setGeoJSON(geoJson)
 },

// initializes the view
 initialize: function(){
  geocoder = L.mapbox.geocoder('zstayman.hn1a3ih4');
  }
});


// loads on pageload
$(document).ready(function(){
  // adds the map to the page
  map = L.mapbox.map('map', 'zstayman.hn1a3ih4').setView([30,0], 2);
  // gets the article objects
  $.getJSON("/articles", function(json){
    // creates the collection with the response
    articles = new ArticleCollection(json.response);

    // creates a view
    view = new ArticleView({collection: articles});

    // runs the render action
    view.render(view.collection, view, view.pushIn);
  });
});



