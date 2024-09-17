require 'factory_bot_rails'

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Initialize the review counter
ReviewCounter.create(count: 0)

# Populate the DB with fake data
# Rake::Task['db:populate_fake_data'].invoke
if Rails.env.development?

  # Crear países
  countries = FactoryBot.create_list(:country, 5)

  # Crear cervecerías (breweries) con marcas (brands) y cervezas (beers)
  countries.map do |country|
    FactoryBot.create(:brewery_with_brands_with_beers, countries: [country])
  end

  # Crear usuarios con direcciones asociadas
  users = FactoryBot.create_list(:user, 10) do |user, i|
    user.address.update(country: countries.sample)
  end

  # Crear bares con direcciones y cervezas asociadas
  bars = FactoryBot.create_list(:bar, 5) do |bar|
    bar.address.update(country: countries.sample)
    bar.beers << Beer.all.sample(rand(1..3))
  end

  # Crear eventos asociados a los bares
  events = bars.map do |bar|
    FactoryBot.create(:event, bar: bar)
  end

  # Crear relaciones de amistad entre usuarios
  users.combination(2).to_a.sample(5).each do |user_pair|
    FactoryBot.create(:friendship, user: user_pair[0], friend: user_pair[1], bar: bars.sample)
  end

  # Crear attendances (asistencia) de usuarios a eventos
  users.each do |user|
    events.sample(rand(1..3)).each do |event|
      FactoryBot.create(:attendance, user: user, event: event, checked_in: [true, false].sample)
    end
  end

  Country.create!(name: 'Chile')
  
  Address.create!(line1: 'Isabel La Católica 4208', line2: 'Las Condes', city: 'Santiago', country_id: Country.last.id, user_id: 3)
  Bar.create!(name: 'Bar la Providencia (Las Condes)', latitude: -33.42796928965203, longitude: -70.57969411973845, address_id: Address.last.id)

  Address.create!(line1: 'Costanera Sur S.J.E. de Balaguer 6400', line2: 'Vitacura', city: 'Santiago', country_id: Country.last.id, user_id: 7)
  Bar.create!(name: 'Bar Santiago Boderio', latitude: -33.379176342578106, longitude: -70.57713633847554, address_id: Address.last.id)

  Address.create!(line1: 'P.º Bulnes 367', line2: 'Santiago', city: 'Santiago', country_id: Country.last.id, user_id: 9)
  Bar.create!(name: 'El Mesón Beer Garden', latitude: -33.45056482517121, longitude: -70.65307964315375, address_id: Address.last.id)

  Address.create!(line1: 'San Antonio 327', line2: 'Santiago', city: 'Santiago', country_id: Country.last.id, user_id: 2)
  Bar.create!(name: 'Bar Quinta Avenida', latitude: -33.43577294110829, longitude: -70.64768450818976, address_id: Address.last.id)

  Address.create!(line1: 'Dublé Almeyda 2900', line2: 'Ñuñoa', city: 'Santiago', country_id: Country.last.id, user_id: 12)
  Bar.create!(name: 'Patio Almeyda', latitude: -33.45538772027981, longitude: -70.60124781082102, address_id: Address.last.id)
end