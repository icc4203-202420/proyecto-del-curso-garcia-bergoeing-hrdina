class API::V1::AttendancesController < ApplicationController
  #include Authenticable
  before_action :set_event
  #check in de los users
  def create
    user = User.find(params[:user_id])
    attendance = Attendance.find_or_initialize_by(user: user, event: @event)
    if attendance.checked_in
      render json: { message: "Ya has confirmado tu asistencia." }, status: :already_reported
    elsif attendance.check_in
      if user.push_token.present?
        PushNotificationService.send_notification(
          to: user.push_token,
          title: "Has confirmado tu asistencia al evento!",
          body: "Estaremos esperandote en el evento #{@event.name}.",
          data: {}
        )
      else
        render json: { message: "Has confirmado tu asistencia." }, status: :ok
      end
    else
      render json: { errors: attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def index
    attendances = @event.attendances.includes(:user)
    render json: attendances.map { |u| { user_id: u.user.id, first_name: u.user.first_name, last_name: u.user.last_name, handle: u.user.handle, checked_in: u.checked_in } }
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Evento no encontrado" }, status: :not_found
  end
end