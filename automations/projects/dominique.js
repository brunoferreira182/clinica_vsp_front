module.exports = {
  defaultDir: '/Users/tiago/Desktop/B3Dev/Codigos/vsp_app/b3dev_clinica_vsp_app_v2',
  defaultDirFilesToCopy: '/Users/tiago/Desktop/B3Dev/Codigos/___Icons - Splash - more/VSP',
  actions: [
    // {
    //   type: 'replaceTextInFile',
    //   file: `/src/composables/variables.js`,
    //   textOut: 'const COMPANY_ID = 10',
    //   textIn: 'const COMPANY_ID = 12'
    // },
    {
      type: 'replaceTextInFile',
      textOut: 'dermaplanner.vsp.b3dev',
      textIn: 'com.dominique.vsp.b3dev',
      files: [
        '/capacitor.config.ts',
        '/android/app/build.gradle',
        '/android/app/src/main/AndroidManifest.xml',
        '/android/app/src/main/java/io/ionic/starter/MainActivity.java',
        '/android/app/src/main/res/values/strings.xml',
      ]
    },
    {
      type: 'replaceTextInFile',
      textOut: 'dermaplanner.vsp.b3dev.ios',
      textIn: 'com.dominique.vsp.b3dev',
      files: [
        '/ios/App/App.xcodeproj/project.pbxproj',
      ]
    },
    {
      type: 'replaceTextInFile',
      textOut: 'return "VSP"',
      textIn: 'return "Dominique"',
      files: [ '/src/composables/utils.js' ]
    },
    {
      type: 'replaceTextInFile',
      textOut: '>VSP</string>',
      textIn: '>Dominique</string>',
      files: [
        '/android/app/src/main/res/values/strings.xml',
        '/ios/App/App/Info.plist'
      ]
    },
    {
      type: 'copyFile',
      to: '/assets/logo.png',
      fileToCopy: '/dominique/cordova-res/Dominique_Ass_Dourado_02.jpg'
    },
    {
      type: 'copyFile',
      to: '/public/logo_login_custom.png',
      fileToCopy: '/dominique/public/Dominique_Ass_Dourado_02.jpg'
    },
    {
      type: 'runCommand',
      commandToRun: "npx @capacitor/assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#222222' --splashBackgroundColor '#212529' --splashBackgroundColorDark '#212529'"
    },
    {
      type: 'runCommand',
      commandToRun: 'ionic cap sync'
    },
  ]
}