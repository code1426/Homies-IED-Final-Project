import { StyleSheet } from 'react-native';
import NavBarRenters from './app/components/NavBarRenters'
import NavBarOwners from './app/components/NavBarOwners';

export default function App() {
  return (
    // <NavBarRenters></NavBarRenters>
    <NavBarOwners />
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
