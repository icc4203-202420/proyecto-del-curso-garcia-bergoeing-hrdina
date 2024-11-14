class FeedChannel < ApplicationCable::Channel
  def subscribed
    stream_from "feed_#{params[:user_id]}"
  end

  def unsubscribed
    # Cleanup when the channel is unsubscribed
  end
end