class API::V1::EventPicturesController < ApplicationController
  before_action :set_event, only: [:create]

  def create
    @event_picture = @event.event_pictures.new(event_picture_params)
    @event_picture.user = current_user

    Rails.logger.debug params

    if @event_picture.save
      render json: { message: 'Imagen subida exitosamente.' }, status: :created
    else
      Rails.logger.debug @event_picture.errors.full_messages
      render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  end

  def event_picture_params
    params.require(:event_picture).permit(:image)
  end
end