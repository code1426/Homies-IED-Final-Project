import React, {useState} from 'react';
import {
    TouchableOpacity, 
    SafeAreaView,
    StyleSheet,
    Image} from 'react-native';


const SelectButton = () => {
    const [imageSource, setImageSource] = useState(require('../assets/circle.png'));

    const [notSelected, selected] = useState(false);
    //     setImageSource(require('../assets/fill.png'))
    // };
    const imageChange = () => {
        if (notSelected) {setImageSource(require('../assets/circle.png'));
    }
        else {setImageSource(require('../assets/fill.png'))
    }
       selected(!notSelected);
    };
   
    return (
        <SafeAreaView style={styles.circleContainer}>
           <TouchableOpacity onPress={imageChange}>
                <Image style={styles.circle} source={imageSource}/>
           </TouchableOpacity>
        </SafeAreaView>
);
};

const styles = StyleSheet.create({
    circleContainer: {
        height: '100%', 
        width: '100%',  
        alignSelf: 'center',
    },
    circle: {
        height: '100%', 
        width: '100%', 
        objectFit: 'contain'
    },
});
export default SelectButton;