require 'rails_helper'

RSpec.describe Bar, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      address = create(:address)
      bar = build(:bar, address: address)
      expect(bar).to be_valid
    end
  
    it 'is invalid without a name' do
      bar = build(:bar, name: nil)
      expect(bar).not_to be_valid
      expect(bar.errors.messages[:name]).to include("can't be blank")
    end
  end

  describe 'attachments' do
    it 'is invalid with non-image files' do
      bar = build(:bar)
      bar.image.attach(io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'test.txt')), filename: 'test.txt', content_type: 'text/plain')
      expect(bar).not_to be_valid
      expect(bar.errors.messages[:image]).to include("must be a valid image format")
    end
  
    it 'is valid with an image file' do
      bar = build(:bar)
      bar.image.attach(io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'test_image.jpg')), filename: 'test_image.jpg', content_type: 'image/jpg')
      expect(bar).to be_valid
    end
  end  
end