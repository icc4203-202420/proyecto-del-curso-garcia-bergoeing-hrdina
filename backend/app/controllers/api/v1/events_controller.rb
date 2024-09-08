class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy]

  # GET /events
  def index
    @events = Event.all
    render json: { events: @event }, status: :ok
  end
  
  # GET /events/:id
  def show
    if @event.image.attached?
      render json: @event.as_json.merge({ 
        image_url: url_for(@event.image), 
        thumbnail_url: url_for(@event.thumbnail)}),
        status: :ok
    else
      render json: { beer: @event.as_json }, status: :ok
    end 
  end

  # POST /events
  def create
    @events = Event.new(event_params.except(:image_base64))
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events/:id
  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # DELETE /events/:id
  def destroy
    @event.destroy
    head :no_content
  end

  private

  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found if @event.nil?
  end  

  def event_params
    params.require(:event).permit(  
      :name, :description, :date,
      :start_date, :end_date, :image_base64,
      :bar_id)
  end

  def handle_image_attachment
    decoded_image = decode_image(event_params[:image_base64])
    @event.image.attach(io: decoded_image[:io], 
      filename: decoded_image[:filename], 
      content_type: decoded_image[:content_type])
  end
end