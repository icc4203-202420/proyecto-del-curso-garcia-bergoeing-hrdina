class API::V1::ReviewsController < ApplicationController
  respond_to :json
  #before_action :set_user, only: [:index, :create]
  before_action :set_review, only: [:show, :update, :destroy]

  def index
    @reviews = Review.where(user: @user)
    render json: { reviews: @reviews }, status: :ok
  end

  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    puts review_params.merge(beer_id: params["beer_id"])
    puts params
    @review = Review.new(review_params.merge(beer_id: params["beer_id"]))
    if @review.save

      # Find list of friends and people in the same bar's event
      friend_ids = @review.user.friends.pluck(:id)

      # Broadcast to all recipients
      friend_ids.each do |recipient_id|
        ActionCable.server.broadcast "feed_#{recipient_id}", {
          type: 'new_feed_item',
          beer_name: @review.beer.name,
          rating: @review.rating,
          review_text: @review.text,
          created_at: @review.created_at.iso8601,
          user_name: @review.user.handle,
          beer_id: @review.beer.id
        }
      end

      render json: @review, status: :created, location: api_v1_review_url(@review)
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end
  
  #def set_user
  #  @user = User.find(params[:user_id]) 
  #end

  def review_params
    params.require(:review).permit(:text, :rating, :beer_id, :user_id)
  end
end
