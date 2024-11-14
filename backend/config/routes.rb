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

      resources :events, only: [:index, :show, :create, :update, :destroy] do
        member do
          get :fetch_video
        end
        resources :attendances
        resources :event_pictures, only: [:create] do
          collection do
            post ':user_id', to: 'event_pictures#create', as: :create_with_user
          end
        end
      end

      resources :users do
        resources :reviews, only: [:index]
        resources :friendships
      end

      resources :reviews, only: [:index, :show, :create, :update, :destroy]
      get 'feed', to: 'feed#index'
    end
  end
end
