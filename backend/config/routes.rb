Rails.application.routes.draw do
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :bars do
        # resources :events, only: [:index, :show] # Add events as a nested resource within bars
        resources :events do
          resources :attendances
        end
      end

      resources :beers do
        resources :reviews, only: [:index, :create]
      end

      resources :events, only: [:show,:create, :update, :destroy] do # Non-nested events routes
        resources :attendances
      end

      resources :users do
        resources :reviews, only: [:index]
        member do
          get 'friendships', to: 'users#friendships'
          post 'friendships', to: 'users#create_friendship'
        end
      end

      resources :reviews, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
