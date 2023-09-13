module.exports = {
  defaultDir: '/Users/tiago/Desktop/B3Dev/Codigos/vsp_app/b3dev_clinica_vsp_app',
  defaultDirFilesToCopy: '/Users/tiago/Desktop/B3Dev/Codigos/___Icons - Splash - more/VSP',
  actions: [
    // {
    //   type: 'replaceTextInFile',
    //   file: `/src/composables/variables.js`,
    //   textOut: 'const COMPANY_ID = 10',
    //   textIn: 'const COMPANY_ID = 12'
    // },
    // {
    //   type: 'replaceTextInFile',
    //   textOut: 'com.vsp.vsp.b3dev',
    //   textIn: 'com.vsp.vsp.b3dev',
    //   files: [
    //     '/capacitor.config.ts',
    //     '/android/app/build.gradle',
    //     '/android/app/src/main/AndroidManifest.xml',
    //     '/android/app/src/main/java/io/ionic/starter/MainActivity.java',
    //     '/android/app/src/main/res/values/strings.xml',
    //     '/ios/App/App.xcodeproj/project.pbxproj',
    //   ]
    // },
    // {
    //   type: 'replaceTextInFile',
    //   textOut: 'return "VSP"',
    //   textIn: 'return "VSP"',
    //   files: [ '/src/composables/utils.js' ]
    // },
    // {
    //   type: 'replaceTextInFile',
    //   textOut: '>VSP</string>',
    //   textIn: '>VSP</string>',
    //   files: [
    //     '/android/app/src/main/res/values/strings.xml',
    //     '/ios/App/App/Info.plist'
    //   ]
    // },
    {
      type: 'copyFile',
      to: '/assets/logo.png',
      // fileToCopy: '/VSP/public/logo-viviam-simoes.svg'
      fileToCopy: '/VSP/cordova-res/logo_vsp_fundo_escuro_1010_1010.png'
    },
    {
      type: 'copyFile',
      to: '/public/logo_login_custom.png',
      // fileToCopy: '/VSP/public/logo-viviam-simoes.svg'
      fileToCopy: '/VSP/public/logo_vsp_fundo_escuro_1010_1010.png'
    },
    // {
    //   type: 'copyFile',
    //   to: '/android/app/google-services.json',
    //   fileToCopy: '/CONIIB/google-services/google-services.json'
    // },
    // {
    //   type: 'copyFile',
    //   to: '/ios/App/App/GoogleService-Info.plist',
    //   fileToCopy: '/CONIIB/google-services/GoogleService-Info.plist'
    // },
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