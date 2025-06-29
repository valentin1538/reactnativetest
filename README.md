# prérequis et environnement de developpement

## vérifier que NodeJS et npm sont installés
```bash
node -v
npm -v
```

## pour android
- un JDK
- android studio
- les variables d'environnement pour android et android-sdk

## pour IoS
- Xcode
- CocoaPods (gestionnaire de dépendances)
```bash
# installation avec ruby
sudo gem install cocoapods
```

## React native CLI
```bash
npm install -g react-native-cli
```

## creation du projet
```bash
npx @react-native-community/cli init reactnativetest
```

# vérification et première execution
```bash
cd reactnativetest
```

## Android
Assurez-vous d'avoir un émulateur Android configuré dans Android Studio ou un appareil Android connecté et configuré pour le débogage USB.
```bash
npx react-native run-android
```

## IoS
Assurez-vous d'avoir Xcode installé et configuré. Naviguez vers le dossier ios de votre projet :
```bash
cd ios
# Installez les dépendances CocoaPods (si ce n'est pas déjà fait) :
pod install
# Retournez au répertoire racine du projet :
cd ..
npx react-native run-ios
```

# préparation au premier build

## Android
Générer une clé de test pour l'application, sinon utiliser votre clé
```bash
cd android
keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
Cette commande crée le fichier *my-release-key.keystore*  

Paramétrer le fichier gradle *android/app/build.gradle*
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("../my-release-key.keystore")
            storePassword "votre_mot_de_passe_keystore"
            keyAlias "my-key-alias"
            keyPassword "votre_mot_de_passe_clé"
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
    ...
}
```
Remplacez *"votre_mot_de_passe_keystore"* et *"votre_mot_de_passe_clé"* par les mots de passe que vous avez définis lors de la création de la clé, et assurez-vous que le chemin vers *my-release-key.keystore* est correct (ici, on suppose qu'il est à la racine du dossier *android*).

Générer le bundle depuis la racine du projet 
```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/build/outputs/bundle/release/app-release.bundle --assets-dest android/app/build/intermediates/assets/release
```
Puis assembler l'APK
```bash
cd android
./gradlew assembleRelease
cd ..
```

# développons
## Configuration de la Navigation avec React Navigation
Pour gérer la navigation entre les pages, nous allons utiliser la librairie react-navigation.

- Installation de React Navigation
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

## Configuration d'une base de donnée interne
- Installation d'une base de données sqlite
```bash
npm install react-native-sqlite-storage
```
- création d'un service de base de donnée avec le fichier Database.js dans le dossier services

---
---
---
---

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
