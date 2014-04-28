namespace :scheduler do
  desc "get articles from the New York Times"
  task get_articles: :environment do
    # gets the first 20 results from the New York Times
    response = HTTParty.get("http://api.nytimes.com/svc/news/v3/content/all/world;u.s.;business;washington;homepage;international+home;national;science;technology/1.json?api-key=#{NYT_WIRE}")
    # Sets the total number of results
    results = response["num_results"]
    # sets the offset for the next api call
    offset = 20
    response["results"].map! do |article|
      unless article["geo_facet"].class == String
        latlng = Geocoder.search(article["geo_facet"].first).first
          unless latlng.nil?
            article["geo_facet"] = latlng.coordinates
          end
        # converts each article to JSON and adds it to a redis sorted set
        $r.xadd "articles", article.to_json, 172800
      end
    end

    while offset < results
      HTTParty.get("http://api.nytimes.com/svc/news/v3/content/all/world;u.s.;business;washington;homepage;international+home;national;science;technology/1.json?offset=#{offset}&api-key=#{NYT_WIRE}")["results"].each do |article|
        unless article["geo_facet"].class == String
          latlng = Geocoder.search(article["geo_facet"].first).first
          unless latlng.nil?
            article["geo_facet"] = latlng.coordinates
          end
          $r.xadd "articles", article.to_json, 172800
        end
      end
      offset += 20
    end
  end

end
