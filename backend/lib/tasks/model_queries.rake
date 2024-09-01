namespace :db do
    task :populate_fake_data => :environment do
      # If you are curious, you may check out the file
      # RAILS_ROOT/test/factories.rb to see how fake
      # model data is created using the Faker and
      # FactoryBot gems.
      puts "Populating database"
      create_list(:country_with_breweries_with_brands_with_beers, 50)
      create_list(:user, 100)
      create_list(:review, 1000)
    end
    task :model_queries => :environment do
      # Sample query: Get the names of the events available and print them out.
      # Always print out a title for your query
      puts "--Start of Query--"
      puts "Total number of beers that exist"
      puts Beer.all.count
      puts "--End Of Query--"
      
      puts "--Start of Query--"
      puts "Take five random beers (display their names)"
      Beer.take(5).map { |x| puts x.name }
      puts "--End Of Query--"

      puts "--Start of Query--"
      puts "Display names of all beers of country with id 2"
      puts Beer.joins(:countries).where("countries.id = 2").map { |x| x.name }
      # Country.find(2).beers.map {|x| x.name }
      puts "--End Of Query--"

      puts "--Start of Query--"
      puts "--Countries where beer with id 10 is brewed--"
      puts Country.joins(:beers).where("beers.id = 10").map { |x| x.name }
      puts "--End Of Query--"

      puts "--Start of Query--"
      puts "--Number of countries wherein each brewery is present --"
      Country.joins(:breweries).group("breweries.name").count.map { |k,v| "#{k} is in #{v} countries." }
      puts "--End Of Query--"

      puts "--Start of Query--"
      puts "--The brewery that is present in the most countries--"
      br = Brewery.joins(:countries).group("breweries.id").order('count(breweries.id) desc').limit(1).first
      br_countries = br.countries.map { |x| x.name }.join(", ")
      puts "The brewery that is present in the most countries (#{br.countries.count} countries in total; #{br_countries}) is #{br.name}."
      puts "--End Of Query--"

      puts "--Start of Query--"
      puts "--The country with the most breweries is--"
      br_max_country = Country.joins(:breweries).group("countries.id").order("count(countries.id) desc").limit(1).first
      puts "#{br_max_country.name}, with #{br_max_country.breweries.count} breweries."
      puts "--End Of Query--"

      puts "--Start of Query--"
      puts "--The beer with the most reviews--"
      Beer.joins(:reviews).select("beers.id, beers.name, count(beers.id) beer_count").group("beers.id").order("beer_count desc").limit(1)
      puts "--End Of Query--"
    end
  end