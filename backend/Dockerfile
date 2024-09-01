# Specify Ruby version
ARG RUBY_VERSION=3.3.4
FROM ruby:$RUBY_VERSION-slim as base

# Install dependencies
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client libvips

WORKDIR /app

# Install gems
COPY Gemfile Gemfile.lock ./
RUN gem install bundler && bundle install --without development test

# Copy the application code
COPY . .

# Precompile assets
RUN RAILS_ENV=production rails assets:precompile

EXPOSE 3001

COPY ./docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]


