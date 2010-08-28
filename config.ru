require 'rack'
require 'vendor/sinatra/lib/sinatra.rb'
require 'entitifier.rb'

set :run, false
set :environment, :production

run Sinatra::Application
