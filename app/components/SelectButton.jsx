import React, {useState} from 'react';
import {
    TouchableOpacity, 
    Text,
    Stylesheet, 
    View,
    SafeAreaView,
    StyleSheet,
    Image} from 'react-native';


const SelectButton = () => {
    const [selected, setSelected] = useState(false);

    
    return (
        <SafeAreaView style={{height: '100%', width: '100%'}}>
            <PreviewLayout
                selectedValue={alignItems}
                values={['renter', 'owner']}
                setSelectedValue={setAlignItems}>
            </PreviewLayout>
        </SafeAreaView>
);
};

const button = require('../assets/circle.png');
const selectedButton = require('../assets/fill.png');

const PreviewLayout = ({
    values, 
    selectedValue,
    setSelectedValue,
    }) => (
    <View style={styles.circleContainer}>
        {values.map(value => (
            <TouchableOpacity
            key={value}
            onPress={() => setSelectedValue(value)}
            style={[styles.button, selectedValue === value && styles.selected]}>
                
            </TouchableOpacity>
        ))}
    
</View>
);

const styles = StyleSheet.create({
    circleContainer: {
        height: '3%', 
        width: '6.5%',  
        margin: 20,
        backgroundColor: 'yellow'
    },
    circle: {
        height: '100%', 
        width: '100%', 
        objectFit: 'fill'
    },
});
export default SelectButton;