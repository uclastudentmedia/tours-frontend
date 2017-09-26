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
        backgroundColor: 'white',
        width: windowWidth,
        height: 60,
        marginBottom: 1,
        paddingLeft: 20,
        borderWidth: 0.5,
        borderColor: '#EEEEEE',
        flex: 1,
        justifyContent: 'center',
    },
    buttonText:{
        textAlignVertical: 'center',
        fontSize: 20
    }
});
