class Brewery < ApplicationRecord
  has_many :brands
  has_many :beers, through: :brands
  has_and_belongs_to_many :countries
end
