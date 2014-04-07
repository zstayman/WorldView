class ArticlesController < ApplicationController
  def new_stories
    # gets the first 20 results from the New York Times
    response = HTTParty.get("http://api.nytimes.com/svc/news/v3/content/all/world;u.s.;business;washington;homepage;international+home;national;science;technology/1.json?api-key=#{NYT_WIRE}")
    # Sets the total number of results
    results = response["num_results"]
    # sets the offset for the next api call
    offset = 20

    # converts each article to JSON and adds it to a redis sorted set
    response["results"].each do |article|
      $r.xadd "articles", article.to_json, 172800
    end
    while offset < results
      HTTParty.get("http://api.nytimes.com/svc/news/v3/content/all/world;u.s.;business;washington;homepage;international+home;national;science;technology/1.json?offset=#{offset}&api-key=#{NYT_WIRE}")["results"].each do |article|
        $r.xadd "articles", article.to_json, 172800
      end
      offset += 20
    end
  end

  def index
    articles = $r.xmembers("articles").map{|article| JSON(article)}
    render json: {"response" => articles}
  end
end
