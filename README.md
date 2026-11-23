# Mutrön — Android-friendly rhythm game prototype

This is a mobile-first playable web app with an Android packaging path via Capacitor.

## Quick preview
Open `app/index.html` in a browser. (For best audio behavior and offline installation, serve over HTTPS.)

## Build an Android APK in GitHub Actions
1. Upload this folder's contents to a new GitHub repository.
2. GitHub Actions will build a debug APK automatically (workflow: `.github/workflows/android-apk.yml`).
3. Open the workflow run and download the `mutron-debug-apk` artifact.
4. On Android, download the artifact, extract `app-debug.apk`, and install it. You may need to allow installs from your browser/files app.

The GitHub Actions workflow performs the Android build in the cloud; no Android Studio is required on your phone.


## Local Android build (computer)
Install Node.js and Android Studio, then:

```sh
npm install
npm run android:setup
cd android && ./gradlew assembleDebug
```
APK path: `android/app/build/outputs/apk/debug/app-debug.apk`.

## Prototype notes
- Timing and rhythm logic are an early prototype and need playtesting, especially silent-mode miss detection.
- Settings are adjustable in the gear/menu.
- BPM, personal best and settings can be further refined in future iterations.

## Android-only phone workflow (no laptop needed)

This is the source bundle; it is **not yet a compiled APK**. To create the APK using GitHub's cloud build from a phone:
1. Create a new GitHub repository in the GitHub mobile browser.
2. Upload the contents of this ZIP (the `mutron_mobile` folder contents, not the folder itself) to the repository root. Ensure `.github/workflows/android-apk.yml` is included; GitHub may hide dot-folders in some upload screens, so verify it exists in the repo.
3. Open the repository's **Actions** tab, select **Build Mutron APK**, and run the workflow (or push to `main`).
4. When the workflow completes, open its run page and download the artifact named `mutron-debug-apk`.
5. Extract `app-debug.apk` on Android and tap it to install. Android may prompt to allow installs from your download/file manager.

If the GitHub mobile upload UI cannot upload folders, the APK build will need a computer or a browser-based workspace that can upload the project tree.
