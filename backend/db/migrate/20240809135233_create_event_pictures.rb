class CreateEventPictures < ActiveRecord::Migration[7.1]
  def change
    create_table :event_pictures do |t|
      t.references :event, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :description

      t.timestamps
    end
  end
end
