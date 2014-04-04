class ArticlesController < ApplicationController
  def new_stories
    response = HTTParty.get("http://api.nytimes.com/svc/news/v3/content/all/world;u.s.;business;washington;homepage;international+home;national;science;technology/1.json?api-key=#{NYT_WIRE}")
    results = response["num_results"]
    offset = 20
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

  def get_articles
    articles = $r.xmembers("articles").map{|article| JSON(article)}
    render json: {"response" => articles}
  end
end
