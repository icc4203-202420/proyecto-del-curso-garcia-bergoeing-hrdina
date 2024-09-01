# en spec/requests/authentication_spec.rb
# https://sdrmike.medium.com/rails-7-api-only-app-with-devise-and-jwt-for-authentication-1397211fb97c
require 'rails_helper'

RSpec.describe 'API::V1::Authentication', type: :request do
  describe 'POST /api/v1/signup' do
    it 'registers a new user' do
      post user_registration_path, params: { 
        user: {
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          handle: 'jdoe342',
          password: 'password',
          password_confirmation: 'password'
        }
      }, headers: { 'ACCEPT' => 'application/json' }
  
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /api/v1/login' do
    let!(:user) { create(:user) }

    it 'authenticates the user and returns a JWT token' do
      post user_session_path, params: { 
        user: {
          email: user.email,
          password: user.password
        }
      }, headers: { 'ACCEPT' => 'application/json' }
      
      expect(response).to have_http_status(:ok)
      expect(response.headers['Authorization']).to be_present
    end

    it 'fails to authenticate with incorrect password' do
      post new_user_session_path, params: {
        user: {
          email: user.email,
          password: 'wrongpassword'
        }, headers: { 'ACCEPT' => 'application/json' }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(response.body).to include('Invalid Email or password')
      expect(response.headers['Authorization']).to be_nil
    end
  end
end
