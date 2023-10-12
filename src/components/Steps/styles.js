import {
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    navigator: {        
        width: '100%',
        display: 'flex',  
        flexDirection: 'row',       
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,        
        paddingBottom: 15,
        paddingHorizontal: 50
    },  
    lineSteps: {
        flexGrow: 1,
        height: 1,               
    },
    stepIcon: {
        width: 25,
        height: 25
    }
});

export default styles;