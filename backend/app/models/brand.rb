class Brand < ApplicationRecord
  has_many :beers
  has_many :countries, through: :brewery
  belongs_to :brewery
end
