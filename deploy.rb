#!/usr/bin/env ruby
require 'Open3'


#@PROJECT_NAME=${PROJECT_NAME} PROJECT_ROOT=${PROJECT_ROOT} DEVICE_TYPE=${DEVICE_TYPE} bash ${PROJECT_ROOT}/bin/titanium.sh

require './build_settings'

#Open3.popen3('echo "tests_enabled = false;" > '+PROJECT_ROOT+'/Resources/tests_enabled.js')

#require './build_module'

#command = 'python ' + TI_BUILD+' distribute '+PROJECT_ROOT+' '+IPHONE_SDK_VERSION+' '+APP_ID+' '+APP_NAME+' '+APP_DEVICE
command = 'python ' + TI_BUILD+' install '+IPHONE_SDK_VERSION+' '+PROJECT_ROOT+' '+APP_ID+' '+APP_NAME+ ' ' + APP_UUID + ' ' + APP_DIST_NAME + ' '+APP_DEVICE

puts "running:" + command
stdin, stdout, wait_thr = Open3.popen3(command)

stdout.each do |line|
  puts line
end

stdin.close  # stdin and stdout should be closed explicitly in this form.
stdout.close

#if wait_thr.value.exitstatus != 0
#  raise "Deploy Failed"
#end