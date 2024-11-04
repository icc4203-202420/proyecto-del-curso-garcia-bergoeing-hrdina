class GenerateEventVideoJob < ApplicationJob
  queue_as :default

  def perform(event)
    images_dir = Rails.root.join('tmp', 'event_images', event.id.to_s)
    video_dir = Rails.root.join('tmp', 'event_videos')
    video_path = video_dir.join("#{event.id}.mp4")

    # Ensure directories exist
    FileUtils.mkdir_p(images_dir)
    FileUtils.mkdir_p(video_dir)

    begin
      # Download images from Active Storage attachments
      event.event_pictures.each_with_index do |picture, index|
        if picture.image.attached?
          image_path = images_dir.join("image_#{index}.jpg")
          File.open(image_path, 'wb') do |file|
            file.write(picture.image.download)
          end
          Rails.logger.debug "Saved picture #{index} to #{image_path}"
        else
          Rails.logger.warn("EventPicture #{picture.id} does not have an attached image.")
        end
      end

      # Generate the video using ffmpeg
      system(
        "ffmpeg -framerate 1/3 -pattern_type glob -i '#{images_dir}/*.jpg' -c:v libx264 -pix_fmt yuv420p #{video_path}"
      )

      # Attach the video to the event
      if File.exist?(video_path)
        event.video.attach(
          io: File.open(video_path),
          filename: 'event_video.mp4',
          content_type: 'video/mp4'
        )
      else
        Rails.logger.error("Video generation failed for event #{event.id}")
      end
    rescue => e
      Rails.logger.error("Error generating video for event #{event.id}: #{e.message}")
    ensure
      # Cleanup temporary directories
      FileUtils.rm_rf(images_dir)
      FileUtils.rm_f(video_path)
    end
  end
end
