module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :verify_jwt_token
  end

  private

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end
end