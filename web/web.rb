require 'rubygems'
require 'sinatra'
require 'pusher'
require 'json'

get '/' do
    puts "The settings public is #{settings.public_folder}"
    send_file File.join(settings.public_folder, 'index.html')
end

get '/comment' do
  Pusher.app_id = '20637'
  Pusher.key = '66ecf4f8dc28f757ecdb'
  Pusher.secret = '55f3263e95e875564531'
  # require 'ruby-debug'
  # debugger
  event = {:user => params[:user] || %w{dave pete paul john anna steph liz bigT john_boy chris harry dinh adam tom}[rand(14)] , :comment => params[:comment], :created_at => Time.now.strftime("%I:%M %p")}
  trigger = Pusher['rea-live-auction'].trigger(params[:listing_id], event)
  content_type :json
  event.to_json
end

