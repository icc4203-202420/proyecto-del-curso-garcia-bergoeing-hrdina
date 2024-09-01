class BarSerializer
  include JSONAPI::Serializer
  attributes :name, :latitude, :longitude, :address, :image, :thumbnail
end
