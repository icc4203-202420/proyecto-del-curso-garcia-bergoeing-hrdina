# Use 'whenever' gem to define a cron job
#every 1.minute do
  #runner "Event.where('end_date <= ?', Time.now).each { |event| GenerateEventVideoJob.perform_later(event) }"
#end