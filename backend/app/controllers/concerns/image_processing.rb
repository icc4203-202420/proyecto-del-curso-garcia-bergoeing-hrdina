module ImageProcessing
  extend ActiveSupport::Concern
  
  def decode_image(data)
    begin
      header, encoded_data = data.split(',')
      if header.blank? || encoded_data.blank?
        Rails.logger.error "Base64 data is incomplete or malformed."
        return nil
      end

      content_type, encoding = header.split(';').first.split(':').last.split('/')
      filename = "upload.#{content_type}"
      decoded_data = Base64.decode64(encoded_data)

      if decoded_data.blank?
        Rails.logger.error "Decoded data is empty after Base64 decoding."
        return nil
      end

      {
        io: StringIO.new(decoded_data),
        filename: filename,
        content_type: "image/#{content_type}"
      }
    rescue => e
      Rails.logger.error "Failed to decode image: #{e.message}"
      nil
    end
  end
end