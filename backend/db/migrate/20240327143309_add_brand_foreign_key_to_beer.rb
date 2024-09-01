class AddBrandForeignKeyToBeer < ActiveRecord::Migration[6.1]
  def change
    add_reference :beers, :brand, foreign_key: true
  end
end
