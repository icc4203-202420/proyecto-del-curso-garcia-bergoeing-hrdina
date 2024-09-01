FactoryBot.define do
  factory :bar do
    name { Faker::Restaurant.name }
    latitude { Faker::Address.latitude }
    longitude { Faker::Address.longitude }
    address
  end
end
