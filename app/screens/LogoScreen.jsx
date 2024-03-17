import { StyleSheet, Text, SafeAreaView, Image, Button } from 'react-native';

export default function LogoScreen({ navigation }) {
  const appLogo = require('../assets/homies-logo-with-app-name.png');
  return (
    <Button onPress={() => navigation.navigate()}>
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.icon}
          source={appLogo}
        />
      </SafeAreaView>
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9CC6DE',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // bottom: 100,
  },
  icon: {
    bottom: 100,
  },
});
