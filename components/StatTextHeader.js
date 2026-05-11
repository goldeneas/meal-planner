import { Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20,
        width: '95%',
        color: '#1c1f1d',
    }
});

const StatTextHeader = ({ text, style = '' }) => {
    return (
        <Text style={[styles.header, style]}>{text}</Text>
    );
};

export default StatTextHeader;
