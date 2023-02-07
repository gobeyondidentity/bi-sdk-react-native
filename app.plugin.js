const { withProjectBuildGradle } = require('@expo/config-plugins');

const withMavenRepo = (config) => {
  let mavenUrl =
    'https://packages.beyondidentity.com/public/bi-sdk-android/maven/';

  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes(mavenUrl)) {
      return config;
    }
    // Insert Beyond Identity maven url inside buildscript.repositories & allprojects.repositories
    // Under google() is an easy place to insert under both sections
    // Warning, contents subject to change in the future as expo controls this file.
    config.modResults.contents = config.modResults.contents.replaceAll(
      `google()`,
      `google()\n        maven { url '${mavenUrl}' }`
    );

    return config;
  });
};

module.exports = withMavenRepo;
