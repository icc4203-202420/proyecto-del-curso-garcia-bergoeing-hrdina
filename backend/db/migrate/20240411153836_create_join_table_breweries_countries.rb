class CreateJoinTableBreweriesCountries < ActiveRecord::Migration[6.1]
  def change
    create_join_table :breweries, :countries do |t|
      t.index [:brewery_id, :country_id]
      t.index [:country_id, :brewery_id]
    end
  end
end
