import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';

const useExitAppBackHandler = (navigationRef) => {
  useEffect(() => {
    const backAction = () => {
      const nav = navigationRef?.current;

      // if user can go back inside stack → allow normal back
      if (nav && nav.canGoBack()) {
        return false;
      }

      //  only root screen → show exit alert
      Alert.alert(
        'Are you sure!',
        'Do you want to quit the app?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Quit', onPress: () => BackHandler.exitApp() },
        ]
      );

      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => subscription.remove();
  }, [navigationRef]);
};

export default useExitAppBackHandler;