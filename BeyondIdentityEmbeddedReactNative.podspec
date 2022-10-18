# THIS FILE IS GENERATED. DO NOT EDIT.
require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "BeyondIdentityEmbeddedReactNative"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/gobeyondidentity/bi-sdk-react-native.git", :tag => s.version.to_s }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.dependency "React-Core"
  s.dependency "BeyondIdentityEmbedded", '1.0.4'

end
