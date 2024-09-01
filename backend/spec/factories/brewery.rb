FactoryBot.define do
  factory :brewery do
    name { Faker::Company.name }
    estdate { Faker::Number.between(from: 1580, to: 1990) }
    
    before(:create) do |brewery|
      brewery.countries = build_list(:country, rand(1..3))
    end

    factory :brewery_with_brands_with_beers do
      transient do 
        brand_count { rand(1..3) }
      end
      after(:create) do |brewery, evaluator|
        create_list(:brand_with_beers, evaluator.brand_count, brewery: brewery)
      end
    end
  end
end