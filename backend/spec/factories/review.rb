FactoryBot.define do
  factory :review do
    user
    beer { Beer.all.sample || association(:beer) }
    text { Faker::ChuckNorris.fact }
    rating { 1.step(by: 0.5, to: 5).to_a.sample }
  end
end