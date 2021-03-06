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
WorldView.map = map

// Article Model
var Article = Backbone.Model.extend({
  urlRoot: '/articles',

// fires the change event to set LatLng
initialize: function(){
  // this.on('change:latlng', this.changeLatLng, this);
  this.changeLatLng(this);
},

// sets LatLng based on geocoder results and orders the map to render
changeLatLng: function(){

  WorldView.geoJson.push(this.dropPin(this));
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

        coordinates: [item.get("geo_facet")[1] + Math.random(), item.get("geo_facet")[0] + Math.random()]
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
    "U.S.": "town-hall",
    "Science": "chemist",
    "World": "embassy",
    "Technology": "polling-place"
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
  render: function(){




  },


// adds pins to the map
pushIn: function(){
 return map.featureLayer.setGeoJSON(WorldView.geoJson)
},

// initializes the view
initialize: function(){
  geocoder = L.mapbox.geocoder('zstayman.hn1a3ih4');
}
});

// loads on pageload
$(document).ready(function(){
  // adds the map to the page

  // gets the article objects
  $.getJSON("/articles", function(json){
    // creates the collection with the response
    articles = new ArticleCollection(json.response);

    // creates a view
    view = new ArticleView({collection: articles});
    map = L.mapbox.map('map', 'zstayman.hn1a3ih4').setView([30,0], 2);
    // runs the render action
    view.render();
    view.pushIn();
  });
});



