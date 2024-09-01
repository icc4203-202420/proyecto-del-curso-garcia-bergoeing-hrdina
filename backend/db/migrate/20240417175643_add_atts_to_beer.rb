class AddAttsToBeer < ActiveRecord::Migration[6.1]
  def change
    add_column :beers, :name, :string
    add_column :beers, :style, :string
    add_column :beers, :hop, :string
    add_column :beers, :yeast, :string
    add_column :beers, :malts, :string
    add_column :beers, :ibu, :string
    add_column :beers, :alcohol, :string
    add_column :beers, :blg, :string
  end
end
