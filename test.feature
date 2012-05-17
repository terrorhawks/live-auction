Feature: Save hudson configuration
  As a build light user
  I want to change the configuration
  In order to choose different jenkins projects

  Scenario: Save Config
  Given my app is running
  When I select "Config" from the menu  
  And I wait for "host" to appear
  And I enter "http://ci.jruby.org/" into "host"
  And I enter "jruby-1-6" into "project name"
  And I press the "save" button
  Then I see the text "Configure changes have been saved" 

  