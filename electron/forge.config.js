const path = require('path');

// Platform-specific binary name
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const binaryName = isWindows ? 'dripline.exe' : 'dripline';

// Detect target architecture for conditional makers
// ELECTRON_FORGE_ARCH is set by electron-forge during make, fallback to process.arch
const targetArch = process.env.ELECTRON_FORGE_ARCH || process.arch;
const isArm64 = targetArch === 'arm64';

// RPM maker has issues on macOS:
// - rpmbuild on macOS doesn't support aarch64 cross-compilation
// - rpmbuild on macOS has path issues with BSD cp command
// Skip RPM maker entirely when building on macOS host
const skipRpm = isMacOS;

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'DripLine',
    executableName: 'DripLine',
    appBundleId: 'io.dripline.app',
    appCategoryType: 'public.app-category.finance',
    icon: path.join(__dirname, 'assets', 'icon'),
    extraResource: [
      path.join(__dirname, '..', 'target', 'release', binaryName),
      ...(isWindows ? [
        path.join(__dirname, 'redist', isArm64 ? 'vc_redist.arm64.exe' : 'vc_redist.x64.exe')
      ] : [])
    ],
    // A free ad-hoc signature keeps the bundle internally verifiable. When an
    // Apple identity is available, the same config upgrades to trusted signing;
    // notarization remains optional because it requires an Apple developer account.
    osxSign: { identity: process.env.APPLE_SIGNING_IDENTITY || '-' },
    ...(process.env.APPLE_ID && process.env.APPLE_PASSWORD && process.env.APPLE_TEAM_ID
      ? {
          osxNotarize: {
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_PASSWORD,
            teamId: process.env.APPLE_TEAM_ID,
          },
        }
      : {}),
    darwinDarkModeSupport: true,
  },
  rebuildConfig: {},
  makers: [
    // =========================================================================
    // macOS Makers
    // =========================================================================
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {}
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        name: 'DripLine',
        icon: path.join(__dirname, 'assets', 'icon.icns'),
        // DMG background is optional - comment out if not present
        background: path.join(__dirname, 'assets', 'dmg-background.png'),
        format: 'UDZO',
        additionalDMGOptions: {
          window: {
            size: {
              width: 600,
              height: 400
            }
          }
        },
        contents: (opts) => [
          { x: 150, y: 200, type: 'file', path: opts.appPath },
          { x: 450, y: 200, type: 'link', path: '/Applications' }
        ]
      }
    },
    // =========================================================================
    // Linux Makers
    // =========================================================================
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        options: {
          name: 'dripline',
          productName: 'DripLine',
          genericName: 'Solana Trading Bot',
          description: 'Automated Solana DeFi trading bot with wallet management',
          categories: ['Finance', 'Utility'],
          icon: path.join(__dirname, 'assets', 'icon.png'),
          maintainer: 'DripLine <support@dripline.io>',
          homepage: 'https://dripline.io'
        }
      }
    },
    // RPM maker - skip on macOS (rpmbuild has path issues and doesn't support aarch64 cross-compilation)
    // RPM packages will only be built when running on a native Linux host
    ...(skipRpm ? [] : [{
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      config: {
        options: {
          name: 'dripline',
          productName: 'DripLine',
          genericName: 'Solana Trading Bot',
          description: 'Automated Solana DeFi trading bot with wallet management',
          categories: ['Finance', 'Utility'],
          icon: path.join(__dirname, 'assets', 'icon.png'),
          license: 'BUSL-1.1',
          homepage: 'https://dripline.io',
          vendor: 'unknown',
          platform: 'linux'
        }
      }
    }]),
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux'],
      config: {}
    },
    // =========================================================================
    // Windows Makers
    // =========================================================================
    {
      name: '@electron-forge/maker-wix',
      platforms: ['win32'],
      config: {
        name: 'DripLine',
        manufacturer: 'DripLine',
        description: 'Automated Solana DeFi trading bot with wallet management',
        language: 1033, // English (United States)
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        // CRITICAL: Set arch to match build target - defaults to x86 if not specified!
        // This determines whether the MSI installs to "Program Files" (x64) or "Program Files (x86)"
        arch: targetArch === 'arm64' ? 'x64' : targetArch, // WIX doesn't support arm64 yet, use x64 for arm64 builds
        ui: {
          chooseDirectory: true, // Allow user to choose install directory
        },
        // Authenticode is optional until a certificate is affordable. Release
        // integrity is still enforced independently with GitHub's asset digest.
        ...(process.env.WINDOWS_CERT_FILE
          ? {
              certificateFile: process.env.WINDOWS_CERT_FILE,
              certificatePassword: process.env.WINDOWS_CERT_PASSWORD,
            }
          : {}),
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
      config: {}
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ],
  hooks: {
    // Stamp the shell's identity into the bundle before anything is packaged.
    // The updater compares this revision against the one a release was built
    // with; when they match, Electron did not change and the release installs as
    // a core-only update instead of a whole installer. Running it here means
    // `start`, `package` and `make` all produce a build that knows its own
    // revision — a build without it simply never takes the silent path.
    generateAssets: async () => {
      const { computeShellRevision, writeShellRevision } = require('./tools/shell-revision.js');
      const revision = writeShellRevision(computeShellRevision());
      console.log(`[forge] shell revision ${revision}`);
    }
  }
};
