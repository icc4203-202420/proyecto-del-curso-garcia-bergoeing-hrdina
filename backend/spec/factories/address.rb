FactoryBot.define do
  factory :address do
    user
    country
    line1 { Faker::Address.street_address }
    line2 { Faker::Address.secondary_address }
    city { Faker::Address.city }
  end
end

