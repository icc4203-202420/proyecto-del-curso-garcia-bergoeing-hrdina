FactoryBot.define do
  factory :brand do
    name { Faker::Beer.brand }
    brewery
    factory :brand_with_beers do
      transient do 
        beer_count { rand(1..3) }
      end

      after(:create) do |brand, evaluator|
        create_list(:beer, evaluator.beer_count, brand: brand)
      end
    end
  end
end