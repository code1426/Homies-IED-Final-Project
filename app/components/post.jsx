import { StyleSheet,
View,
TouchableOpacity,
Image,
Text,
 } from "react-native";

function PostCard() {
    return (
        <TouchableOpacity style={{height: 270, width: 414, padding: 20}} onPress={() => console.log("Post tapped")}>
            
            <View style={[{height: 250,
                        width: 360,
                        backgroundColor: 'white',
                        borderRadius: 20}, styles.shadow]}>
            <Image 
                style={{height: 160,
                        width: 360,
                        borderRadius: 20}}
                source={require("../assets/bedspace.jpg")}/>
            
                <View style={{height: 90,
                            width: 360,
                            borderRadius: 20,
                            flexDirection:'row'}}>
                <View style={{height: 90,
                            width: 230,
                            borderRadius: 20}}> 
                    <Text style={styles.postTitle}>Boarding House</Text>
                    <Text style={styles.postLocation}>Jaro, Iloilo City</Text>
                </View>
                <View style={{height: 90,
                            width: 130,
                            alignSelf: 'flex-end',
                            borderRadius: 20}}>
                    <Text style={styles.price}>Php 3, 000</Text>
                    <Text style={styles.monthly}>monthly</Text>
                </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 10,
    },
    postTitle: {
        marginTop: 13,
        marginBottom: 2,
        marginLeft: 20,
        fontFamily: "Arial",
        fontWeight: 600,
        fontSize: 18,
        color: "black",
    },
    postLocation: {
        marginLeft: 20,
        fontFamily: "Arial",
        fontSize: 14,
        fontWeight: 600,
        color: "grey",
    },
    price: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 2,
        fontFamily: "Arial",
        fontWeight: 600,
        fontSize: 20,
        color: "teal",
    },
    monthly: {
        paddingLeft: 60,
        fontFamily: "Arial",
        fontSize: 14,
        fontWeight: 600,
        color: "grey",
    },

});
export default PostCard;