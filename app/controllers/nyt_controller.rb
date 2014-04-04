class NytController < ApplicationController
  def new_stories
    response = HTTParty.get("http://api.nytimes.com/svc/news/v3/content/all/world;u.s.;business;washington;homepage;international+home;national;science;technology/1.json?api-key=#{NYT_WIRE}")
    results = response["num_results"]
    response["results"].each do |article|
      $r.xadd "articles", article, 172800
    end
  end
end
