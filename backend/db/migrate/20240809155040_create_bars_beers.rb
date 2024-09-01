class CreateBarsBeers < ActiveRecord::Migration[7.1]
  def change
    create_table :bars_beers do |t|
      t.references :bar, null: false, foreign_key: true
      t.references :beer, null: false, foreign_key: true

      t.timestamps
    end
    add_index :bars_beers, [:bar_id, :beer_id], unique: true  
  end
end
