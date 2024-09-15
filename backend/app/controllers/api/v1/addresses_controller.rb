class API::V1::AddressesController < ApplicationController

  respond_to :json
  before_action :set_address, only: [:index]
  before_action :set_bar, only: [:index]

  def index
    addresses = @bar.addresses
      
    render json: { addresses: addresses }, status: :ok 
  end

  private
  def set_bar
      @bar = Bar.find(params[:bar_id])
      render json: { error: 'Bar not found' }, status: :not_found if @bar.nil?
  end
  def set_address
      @address = Address.find_by(id: params[:id])
      render json: { error: 'Address not found' }, status: :not_found if @address.nil?
  end
end