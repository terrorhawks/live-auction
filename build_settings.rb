PROJECT_ROOT='.'
APP_DEVICE='iphone'
IPHONE_SDK_VERSION='5.0'
TI_SDK_VERSION='1.7.3'
TI_DIR='~/Library/Application\ Support/Titanium'
TI_ASSETS_DIR=TI_DIR + '/mobilesdk/osx/'+TI_SDK_VERSION
TI_IPHONE_DIR=TI_ASSETS_DIR + '/iphone'
TI_BUILD= TI_IPHONE_DIR + '/builder.py'

# Get APP parameters from current tiapp.xml
APP_ID='RUWUAW5Z24.com.diuscomputing.realiveauction'
APP_UUID='F0D4603C-80F3-4D05-8108-9CDCBB5B30A8'
APP_DIST_NAME="David Clarke"
APP_NAME='LiveAuctions'

ANDROID_HOME='/Users/davidclarke/bin/android-sdk'
ANDROID_EMULATOR = ANDROID_HOME + '/tools/emulator'
ANDROID_DEPLOY = TI_BUILD
ANDROID_DEPLOY_OPTS = ' install live-action /Users/davidclarke/bin/android-sdk /Users/davidclarke/workspace/_titanium/live-auction HR4LVL7TKY.au.com.dius.buildlight 11'
ANDROID_OPTS = ' -avd titanium_9_HVGA -port 5560 -sdcard ~/.titanium/titanium_9_HVGA.sdcard -logcat *:d,* -no-boot-anim -partition-size 128'
