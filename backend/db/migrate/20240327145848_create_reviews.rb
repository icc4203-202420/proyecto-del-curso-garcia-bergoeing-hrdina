class CreateReviews < ActiveRecord::Migration[6.0]
  def change
    create_table :reviews do |t|
      t.text :text
      t.decimal :rating
      t.integer :user_id, null: false
      t.integer :beer_id, null: false

      t.timestamps
    end

    add_foreign_key :reviews, :users, column: :user_id
    add_foreign_key :reviews, :beers, column: :beer_id, on_delete: :cascade
    add_index :reviews, :user_id
    add_index :reviews, :beer_id
  end
end