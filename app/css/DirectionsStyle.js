import React, {
    StyleSheet,
    Dimensions
} from 'react-native';

const {height, width} = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'flex-end',
        backgroundColor: '#EEEEEE',
        width:width,
        height:height
    },
    search:{
        flexDirection: 'column', 
        flex: 1
    },
    button:{
        width: windowWidth,
        marginBottom: 1
    }
});
