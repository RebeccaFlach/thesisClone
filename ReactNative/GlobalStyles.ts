const secondaryTextColor = '#c0c0c0';
const textColor = '#e5e5e5';
const borderColor = '#444444';

const GlobalStyles = {
    container: {
        backgroundColor: '#121219',
        height: '100%',
    },
    text: {
        color: textColor,
    },
    section: {
        borderTopWidth: 1,
        borderTopColor: borderColor,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        marginTop: -1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 2
    },
    secondaryText: {
        color: secondaryTextColor,
    },

    header: {
        headerStyle: {
            backgroundColor: '#121219'
        },
        headerTitleStyle: {
            color: '#e5e5e5',
        },
        headerBackTitleVisible: false,
    },
    input: {
        height: 30,
        width: '80%',
        color: secondaryTextColor,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        margin: 30,
        paddingLeft: 10,
        paddingRight: 10
      
    },
};

export default GlobalStyles;