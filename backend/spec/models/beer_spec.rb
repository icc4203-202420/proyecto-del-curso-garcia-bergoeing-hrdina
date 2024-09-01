require 'rails_helper'

RSpec.describe Beer, type: :model do
  describe 'associations' do
    it 'has many reviews' do
      beer = create(:beer_with_reviews)
      expect(beer.reviews.length).to be_positive
    end
  end

  describe 'associations and validations' do
    it 'is valid without an image' do
      beer = build(:beer)
      expect(beer).to be_valid
    end

    it 'is invalid with incorrect content type' do
      beer = build(:beer)
      beer.image.attach(io: File.open('spec/fixtures/files/test.txt'), filename: 'test.txt', content_type: 'text/plain')
      expect(beer).not_to be_valid
      expect(beer.errors[:image]).to include('must be a valid image format')
    end
  end  

  describe 'attributes' do
    let(:beer) { build(:beer) }

    it 'is valid with valid attributes' do
      expect(beer).to be_valid
    end

    it 'is invalid without a name' do
      beer.name = nil
      expect(beer).not_to be_valid
    end
  end

  describe 'reviews' do
    context 'when a beer has multiple reviews' do
      let(:beer) { create(:beer_with_reviews, review_count: 5) }

      it 'can access its reviews' do
        expect(beer.reviews.count).to eq(5)
        beer.reviews.each do |review|
        end
      end

      it 'deletes associated reviews when deleted' do
        expect(beer.reviews.size).to eq(5)
        expect { beer.destroy }.to change { beer.reviews.reload.size }.from(5).to(0)
      end
    end
  end
end