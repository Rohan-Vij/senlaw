# senlaw frontend

NOTE: This uses `tailwind-rn`, so in development, make two terminals, one running `npm run dev:tailwind`, and the other running `npm run android` (or `ios`). **MAKE SURE TO RELOAD EVERY TIME YOU SEE THE ERROR "Unsupported Tailwind class" (press `r`)!!**

## NOTE: MAKE SURE TO CHANGE THE IP ADDRESS IN `src/config.ts` TO YOURS!!

Commands to run (for my reference; run these in seperate terminals)

```ps
# NOTE: the below command will be different based on which emulator is installed. Run
# emulator -list-avds to find all AVDs installed.
emulator -avd Samsung_Galaxy_Note_8_API_32 # runs the android emulator
npm run dev:tailwind # runs the tailwind server
npm run android # runs the expo server to serve on android
```

building:

```ps
npm run build:tailwind
# npm install -g eas-cli
eas build -p android
# download aab file
# download https://github.com/google/bundletool/releases/tag/1.10.0
# rename aab file to "senlaw.aab"
cd Downloads
java -jar .\bundletool-all-1.10.0.jar build-apks --bundle=senlaw.aab --output=senlaw.apks --mode=universal
mv .\senlaw.apks .\senlaw.zip
# extract and get universal.apk
# send to phone to install
```

**THIS HAS ONLY BEEN TESTED ON ANDROID!** (someone test on ios when? I don't have an iphone lol)
