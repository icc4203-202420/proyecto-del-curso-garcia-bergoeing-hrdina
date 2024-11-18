class API::V1::EventPicturesController < ApplicationController
  include ImageProcessing
  before_action :set_event, only: [:create]

  def create
    Rails.logger.debug params
    @event_picture = @event.event_pictures.new(event_picture_params)
    @event_picture.user = User.find(params["user_id"].to_i)
    

    if @event_picture.save
      tagged_handles = extract_handles(@event_picture.description)
      notify_tagged_users(tagged_handles)

      # Find list of friends and people in the same bar's event
      friend_ids = @event_picture.user.friends.pluck(:id)
      event_participant_ids = @event.attendances.pluck(:user_id) # Assuming `@event` has a `participants` association

      # Combine unique user IDs
      recipient_ids = (friend_ids + event_participant_ids).uniq

      # Broadcast to all recipients
      recipient_ids.each do |recipient_id|
        ActionCable.server.broadcast "feed_#{recipient_id}", {
          type: 'new_feed_item',
          image_url: @event_picture.image.attached? ? url_for(@event_picture.image) : nil,
          description: @event_picture.description,
          created_at: @event_picture.created_at.iso8601,
          event_name: @event_picture.event&.name,
          user_name: @event_picture.user&.handle,
          bar_id: @event_picture.event&.bar_id,
          bar_name: @event_picture.event&.bar&.name,
          event_id: @event_picture.event_id
        }
      end

      render json: { message: 'Imagen subida exitosamente.' }, status: :created
    else
      Rails.logger.debug @event_picture.errors.full_messages
      render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def handle_image_attachment
    decode_image = decode_image(event_params[:image_base64])
    @event.flyer.attach(io: decoded_image[:io],
        filename: decode_image[:filename],
        content_type: decoded_image[:content_type]
    )
end

  def set_event
    @event = Event.find(params[:event_id])
  end

  def event_picture_params
    params.require(:event_picture).permit(:image, :description)
  end

  def extract_handles(description)
    description.scan(/@\w+/).map { |handle| handle.delete('@') }
  end
  
  def notify_tagged_users(handles)
    users = User.where(handle: handles)
    users.each do |user|
      if user.push_token.present?
        PushNotificationService.send_notification(
          to: user.push_token,
          title: "¡Fuiste etiquetado en una foto!",
          body: "El usuario #{@event_picture.user.handle} te ha etiquetado en una foto del evento.",
          data: { screen: "EventGallery", event_id: @event.id }
        )
      end
    end
  end

end