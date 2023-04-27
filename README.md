# Graysky

Graysky is a Bluesky client written in React Native. 🚧 WIP 🚧

> I've only tested this on iOS, your mileage may vary on Android.

## Getting Started

You'll need pnpm, and some sort of simulator or device to run the app on.

```bash
pnpm install
```

> Weird side step - you need to go to `apps/expo/app.config.ts` and delete the `extra` field which has an expo project id in it. Sorry, I'll fix this later.

You can then start the expo server with:

```bash
pnpm dev:expo
```

(Note: this is just a shortcut for `expo start`)

Then just scan the QR code!

## Roadmap to Feature Parity

- [x] Notifications screen
- [x] Image viewer
- [x] Pull to refresh fix
- [x] Haptics
- [ ] Post composer
- [ ] Reply/Quote composer
- [ ] Dark mode
- [ ] Sidebar w/ logout button
- [ ] Followers/Following screens
- [ ] Settings screen
- [ ] Context menu - post actions
- [ ] Context menu - user actions
- [ ] Image viewer: Pinch to zoom
- [ ] Better haptics
- [ ] Search screen
- [ ] Push notifications
- [ ] App Store???
