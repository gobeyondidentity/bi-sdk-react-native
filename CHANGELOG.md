# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] - 2025-09-16

### Added

- New attribute passkeyId has been added to the Passkey model. This ID matches the cloud ID found in the console.

### Changed

- Update authentication flow to improve performance, stability, and security
- Support React Native 0.81.4+
- Support Android 16KB page size

## [2.0.1] - 2023-09-25

### Added

- New function getAuthenticationContext to retrieve authentication parameters for the ongoing transaction.
- New function authenticateOtp to enable authentication with a one time password.
- New function redeemOtp to enable redeeming a one time password.

## [2.0.0] - 2023-01-09

### Added

- A new expo config plugin to support development builds or prebuilds on expo

### Changed

- Rename instances of `Credential` to `Passkey`
- Update example app to authenticate with Beyond Identity by using Invocation Type `manual`
- Prefixed `Credential` properties to prevent name conflicts
- Nest tenantId, realmId, and identityId under appropriate objects in the `Credential`
- Update support links in the example app

### Fixed

- Scheme without a path is now recognized as a valid URL when binding a credential

## [1.0.0] - 2022-09-21

### Changed

- Updated the React Native SDK to support our newly released Secure Customer product. See the [documentation](https://developer.beyondidentity.com) for more details.
