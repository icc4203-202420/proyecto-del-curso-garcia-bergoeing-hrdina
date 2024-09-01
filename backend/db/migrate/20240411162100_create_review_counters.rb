class CreateReviewCounters < ActiveRecord::Migration[6.1]
  def change
    create_table :review_counters do |t|
      t.integer :count

      t.timestamps
    end
  end
end
