# VitaSync Android Setup via Capacitor

VitaSync is an Android-first application packaged using `@capacitor/core` and `@capacitor/android`.

## Prerequisites

1. **Node.js**: v20+ and `pnpm` v9+
2. **Android Studio**: Android Studio Koala / Ladybug or newer.
3. **Java Development Kit (JDK)**: OpenJDK 17 or 21 (bundled with Android Studio or installed separately).
4. **Android SDK**:
   - SDK Platform 34 (Android 14) or SDK Platform 35 (Android 15).
   - Android SDK Build-Tools 34.0.0+.
   - Android SDK Command-line Tools.
5. **Environment Variables**:
   ```bash
   export ANDROID_HOME=$HOME/AppData/Local/Android/Sdk # (Windows)
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

---

## Workflow Commands

### 1. Build the Web Application

Before syncing with Capacitor, create a production build of the web app:

```bash
# From repository root
pnpm --filter @vitasync/web build
```

This compiles TypeScript, bundles React with Vite, and outputs optimized assets into `apps/web/dist`.

---

### 2. Initialize the Android Platform (One-Time Setup)

To generate the native Android Studio project folder in `apps/web/android`:

```bash
# From apps/web directory
npx cap add android
```

---

### 3. Synchronize Web Assets and Plugins

Whenever you make frontend changes or install Capacitor plugins:

```bash
pnpm --filter @vitasync/web build
pnpm --filter @vitasync/web cap:sync
# Or: npx cap sync android inside apps/web
```

---

### 4. Open in Android Studio

Launch the generated Android project directly in Android Studio:

```bash
pnpm --filter @vitasync/web cap:open:android
# Or: npx cap open android inside apps/web
```

From Android Studio:

- Select an Android Virtual Device (AVD) running API 34+ or connect a physical Android device via USB with USB Debugging enabled.
- Click **Run 'app'** (`Shift + F10`).

---

### 5. Live Reload for Android Development

For rapid local iteration with hot module reloading on your Android device:

```bash
# In apps/web/capacitor.config.ts, point server.url to your workstation LAN IP:
# server: { url: 'http://<YOUR_LAN_IP>:5173', cleartext: true }
pnpm dev:web
npx cap run android -l --external
```
