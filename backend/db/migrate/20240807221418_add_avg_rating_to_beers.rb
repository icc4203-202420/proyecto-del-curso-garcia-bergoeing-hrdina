class AddAvgRatingToBeers < ActiveRecord::Migration[7.1]
  def change
    add_column :beers, :avg_rating, :float
  end
end
