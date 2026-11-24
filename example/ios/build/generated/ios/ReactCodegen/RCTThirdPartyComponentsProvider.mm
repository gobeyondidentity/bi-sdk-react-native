/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


#import <Foundation/Foundation.h>

#import "RCTThirdPartyComponentsProvider.h"
#import <React/RCTComponentViewProtocol.h>

@implementation RCTThirdPartyComponentsProvider

+ (NSDictionary<NSString *, Class<RCTComponentViewProtocol>> *)thirdPartyFabricComponents
{
  static NSDictionary<NSString *, Class<RCTComponentViewProtocol>> *thirdPartyComponents = nil;
  static dispatch_once_t nativeComponentsToken;

  dispatch_once(&nativeComponentsToken, ^{
    thirdPartyComponents = @{
		@"RNCSafeAreaProvider": NSClassFromString(@"RNCSafeAreaProviderComponentView"), // react-native-safe-area-context
		@"RNCSafeAreaView": NSClassFromString(@"RNCSafeAreaViewComponentView"), // react-native-safe-area-context
		@"RNCWebView": NSClassFromString(@"RNCWebView"), // react-native-webview
		@"RNSFullWindowOverlay": NSClassFromString(@"RNSFullWindowOverlay"), // react-native-screens
		@"RNSModalScreen": NSClassFromString(@"RNSModalScreen"), // react-native-screens
		@"RNSScreenContainer": NSClassFromString(@"RNSScreenContainerView"), // react-native-screens
		@"RNSScreenContentWrapper": NSClassFromString(@"RNSScreenContentWrapper"), // react-native-screens
		@"RNSScreenFooter": NSClassFromString(@"RNSScreenFooter"), // react-native-screens
		@"RNSScrollToTopGuard": NSClassFromString(@"RNSScrollToTopGuard"), // react-native-screens
		@"RNSScreen": NSClassFromString(@"RNSScreenView"), // react-native-screens
		@"RNSScreenNavigationContainer": NSClassFromString(@"RNSScreenNavigationContainerView"), // react-native-screens
		@"RNSScreenStackHeaderConfig": NSClassFromString(@"RNSScreenStackHeaderConfig"), // react-native-screens
		@"RNSScreenStackHeaderSubview": NSClassFromString(@"RNSScreenStackHeaderSubview"), // react-native-screens
		@"RNSScreenStack": NSClassFromString(@"RNSScreenStackView"), // react-native-screens
		@"RNSSearchBar": NSClassFromString(@"RNSSearchBar"), // react-native-screens
		@"RNSStackScreen": NSClassFromString(@"RNSStackScreenComponentView"), // react-native-screens
		@"RNSStackHost": NSClassFromString(@"RNSStackHostComponentView"), // react-native-screens
		@"RNSStackHeaderConfigIOS": NSClassFromString(@"RNSStackHeaderConfigComponentView"), // react-native-screens
		@"RNSStackHeaderItemIOS": NSClassFromString(@"RNSStackHeaderItemComponentView"), // react-native-screens
		@"RNSStackHeaderItemSpacerIOS": NSClassFromString(@"RNSStackHeaderItemSpacerComponentView"), // react-native-screens
		@"RNSTabsScreenIOS": NSClassFromString(@"RNSTabsScreenComponentView"), // react-native-screens
		@"RNSTabsHostIOS": NSClassFromString(@"RNSTabsHostComponentView"), // react-native-screens
		@"RNSTabsBottomAccessory": NSClassFromString(@"RNSTabsBottomAccessoryComponentView"), // react-native-screens
		@"RNSTabsBottomAccessoryContent": NSClassFromString(@"RNSTabsBottomAccessoryContentComponentView"), // react-native-screens
		@"RNSSplitHost": NSClassFromString(@"RNSSplitHostComponentView"), // react-native-screens
		@"RNSSplitScreen": NSClassFromString(@"RNSSplitScreenComponentView"), // react-native-screens
		@"RNSSafeAreaView": NSClassFromString(@"RNSSafeAreaViewComponentView"), // react-native-screens
		@"RNSScrollViewMarker": NSClassFromString(@"RNSScrollViewMarkerComponentView"), // react-native-screens
		@"RNSFormSheetHost": NSClassFromString(@"RNSFormSheetHostComponentView"), // react-native-screens
		@"RNSFormSheetContentWrapper": NSClassFromString(@"RNSFormSheetContentWrapperComponentView"), // react-native-screens
    };
  });

  return thirdPartyComponents;
}

@end
