require 'rails_helper'

RSpec.describe "API::V1::Reviews", type: :request do
  let(:user) { create(:user) }
  let(:beer) { create(:beer) }
  let(:review) { create(:review, user: user, beer: beer) }
  let(:valid_attributes) { { text: 'Updated review', rating: 4, beer_id: beer.id } }
  let(:invalid_attributes) { { text: '', rating: nil } }

  describe "GET /show" do
    context "when the review exists" do
      it "returns the review" do
        get api_v1_review_path(review)
        expect(response).to have_http_status(:ok)
        expect(response.body).to include(review.text)
        expect(response.body).to include(review.rating.to_s)
      end
    end

    context "when the review does not exist" do
      it "returns a not found status" do
        get api_v1_review_path(id: -1)  # Using a non-existing ID
        expect(response).to have_http_status(:not_found)
        expect(response.body).to include("Review not found")
      end
    end
  end  

  describe "GET /index" do
    it "returns all reviews for a user" do
      user = create(:user)
      create(:review, user: user)
      get api_v1_user_reviews_path(user_id: user.id)
      expect(response).to have_http_status(:ok)
      expect(json_response.size).to eq(user.reviews.count)
    end
  end

  describe "POST /create" do
    let(:user) { create(:user) }
    let(:beer) { create(:beer) }
    let(:review_attributes) { { text: "Great beer", rating: 5, beer_id: beer.id } }
  
    it "creates a new Review" do
      expect {
        post api_v1_reviews_path, params: { review: review_attributes, user_id: user.id }
      }.to change(Review, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end
  
  describe "PATCH /update" do
    let(:review) { create(:review) }
    let(:new_attributes) { { text: "Updated review text" } }
  
    it "updates the requested review" do
      patch api_v1_review_path(review), params: { review: new_attributes }
      review.reload
      expect(review.text).to eq("Updated review text")
      expect(response).to have_http_status(:ok)
    end
  end
  
  describe "DELETE /destroy" do
    let!(:review) { create(:review) }
  
    it "destroys the requested review" do
      expect {
        delete api_v1_review_path(review)
      }.to change(Review, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
