import { StyleSheet } from 'react-native';
import NavBarRenters from './app/components/NavBarRenters'

export default function App() {
  return (
    <NavBarRenters></NavBarRenters>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9CC6DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
