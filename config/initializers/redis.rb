$redis = Redis.new
$r = Redis::ExpiringSet.new($redis)
