class API::V1::FriendshipsController < ApplicationController
  before_action :set_user

  # GET /api/v1/users/:user_id/friendships
  def index
    friends = @user.friends
    render json: friends, status: :ok
  end

  # POST /api/v1/users/:user_id/friendships
  def create
    friend = User.find_by(id: params[:friend_id])
    if friend.nil?
      render json: { error: "Friend not found" }, status: :not_found
      return
    end
  
    if @user.id == friend.id
      render json: { error: "You cannot be friends with yourself." }, status: :unprocessable_entity
      return
    end
  
    @friendship = Friendship.new(user_id: @user.id, friend_id: friend.id, bar_id: params[:bar_id], event_id: params[:event_id])
  
    if @friendship.save
      render json: { message: "Friendship created successfully." }, status: :created
    else
      render json: { errors: @friendship.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id]) # Cambiado a user_id
  end
end
