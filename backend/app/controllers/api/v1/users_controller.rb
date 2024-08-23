class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]
  
  # GET /users
  def index
    @users = User.includes(:reviews, :address).all   
  end

  # GET /users/:id
  def show
    
  end

  #Added friendship funcions

  # GET /users/:id/friendship
  def friendships
    @friends = Friendship.find(params[:id])
  end

  # POST /users/:id/friendship
  def create_friendship
    friend = User.find(params[:friend_id])
    @friendship = Friendship.new(user_id: @user.id, friend_id: friend.id, bar_id: params[:bar_id])

    if @friendship.save
      render json: { message: "Friendship created successfully." }, status: :created
    else
      render json: { errors: @friendship.errors }, status: :unprocessable_entity
    end
  end

  #Up to here

  # POST /users
  def show
  
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

    # PATCH/PUT /users/:id
  def update
    #byebug
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end

  # Also added verify token
  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end  
end
