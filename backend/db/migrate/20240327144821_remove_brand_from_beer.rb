class RemoveBrandFromBeer < ActiveRecord::Migration[6.1]
  def change
    remove_column(:beers, :brand)
    remove_column(:beers, :subbrand)
  end
end
