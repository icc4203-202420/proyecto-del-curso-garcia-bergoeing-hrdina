class FeedChannel < ApplicationCable::Channel
  def subscribed
    user_id = params['user_id']
    stream_from "feed_#{user_id}" if user_id
  end

  def unsubscribed
    # Cleanup when the channel is unsubscribed
  end
end