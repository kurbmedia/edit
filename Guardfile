# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'coffeescript', :input => 'src', :output => 'lib', :all_on_start => true
guard 'coffeescript', :output => 'spec', :bare => true do
  watch(%r{spec/src/(.+\.coffee)})
end
