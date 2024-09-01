class AddCheckedInToAttendances < ActiveRecord::Migration[7.1]
  def change
    add_column :attendances, :checked_in, :boolean
    add_column :attendances, :default, :string
    add_column :attendances, :false, :string
  end
end
