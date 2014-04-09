if ENV["REDISCLOUD_URL"]
    uri = URI.parse(ENV["REDISCLOUD_URL"])
    $redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
    $r = Redis::ExpiringSet.new($redis)
  else
    $redis = Redis.new
    $r = Redis::ExpiringSet.new($redis)
end

