class RemoveAlcvolFromBeer < ActiveRecord::Migration[6.1]
  def change
    remove_column :beers, :alcvol
  end
end
