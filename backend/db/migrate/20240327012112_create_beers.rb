class CreateBeers < ActiveRecord::Migration[6.1]
  def change
    create_table :beers do |t|
      t.string :brand
      t.string :subbrand
      t.string :beer_type
      t.decimal :alcvol

      t.timestamps
    end
  end
end
