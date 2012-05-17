#!/usr/bin/env ruby
require 'Open3'

#@PROJECT_NAME=${PROJECT_NAME} PROJECT_ROOT=${PROJECT_ROOT} DEVICE_TYPE=${DEVICE_TYPE} bash ${PROJECT_ROOT}/bin/titanium.sh

require './build_settings'

#Open3.popen3('echo "tests_enabled = false;" > '+PROJECT_ROOT+'/Resources/tests_enabled.js')

#require './build_module'



command = ANDROID_EMULATOR + ANDROID_OPTS

puts "running:" + command
stdin, stdout, wait_thr = Open3.popen3(command)

stdout.each do |line|
  puts line
end

stdin.close  # stdin and stdout should be closed explicitly in this form.
stdout.close

Open3.popen3('killall "Android Emulator"')

