class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]
  before_action :verify_jwt_token, only: [:create, :update, :friendships, :create_friendship]
  
  # GET /users
  def index
  if params[:user_id]
    user = User.find(params[:user_id].to_i)
    @users = User.where.not(id: user.id).includes(:friendships)

    # Añade la información de eventos y bares en los que han coincidido
    users_with_friend_status = @users.map do |u|
      event_info = u.events.map do |event|
        {
          event_id: event.id,
          event_name: event.name,
          bar_id: event.bar_id,
          bar_name: event.bar.name
        }
      end

      u.as_json.merge(
        is_friend: u.friendships.exists?(friend_id: user.id),
        events: event_info
      )
    end

    render json: users_with_friend_status, status: :ok
  else
    render json: { error: 'User ID not provided' }, status: :bad_request
  end
end


  # GET /users/:id
  def show
    #render json: @user, status: :ok
  end

  # GET /users/:id/friendship
  def friendships
    @friends = Friendship.find(params[:id])
  end

  # POST /users/:id/friendship
  def create_friendship
    friend = User.find(params[:friend_id])
    if friend.nil?
      render json: { errors: "Friend not found" }, status: :not_found
      return
    end

    @friendship = Friendship.new(user_id: @user.id, friend_id: friend.id, bar_id: params[:bar_id])

    if @friendship.save
      render json: { message: "Friendship created successfully." }, status: :created
    else
      render json: { errors: @friendship.errors }, status: :unprocessable_entity
    end
  end

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
        permit(:id, :first_name, :last_name, :email, :age, :push_token,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end  
end
