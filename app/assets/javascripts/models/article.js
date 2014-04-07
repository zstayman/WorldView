var Article = Backbone.Model.extend({
  urlRoot: '/articles'
});

var ArticleCollection = Backbone.Collection.extend({
  model: Article,
  url: '/articles'
});

var ArticleView = Backbone.View.extend({
  render: function(collection, view){
    _.each(collection.models, function(elem){
      if(elem.attributes.geo_facet !== "" ){
        var x;
        geocoder.query(elem.attributes.geo_facet[0], function(nada, data){
          elem.attributes.latlng = data.latlng
          view.dropPin(elem.attributes);}
        )};

      }
      )},

    dropPin: function(item){
      L.mapbox.featureLayer({
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type: 'Feature',
    geometry: {
      type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats

        coordinates: [item.latlng[1], item.latlng[0]]
      },
      properties: {
        title: item.title,
        description: item.abstract,
        // one can customize markers by adding simplestyle properties
        // http://mapbox.com/developers/simplestyle/
        'marker-size': 'small',
        'marker-color': '#5999E8'
      }
    }).addTo(map);
    },

    initialize: function(){
      this.render(this.collection, this);
    }
  });

var articles, map, geocoder, view;

$(document).ready(function(){

  $.getJSON("/articles").done(function(json){
    articles = new ArticleCollection(json.response);
    view = new ArticleView({collection: articles});
  });
  geocoder = L.mapbox.geocoder('zstayman.hn1a3ih4')
  map = L.mapbox.map('map', 'zstayman.hn1a3ih4')
});

