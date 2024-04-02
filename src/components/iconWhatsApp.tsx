import React from "react";
import { StyleService, useStyleSheet } from "@ui-kitten/components";
import { ImageBackground, View } from "react-native";

export interface IconWhatsAppProps {
    telefone: string;
}

export const IconWhatsApp = (props: IconWhatsAppProps): React.ReactElement<IconWhatsAppProps> => {
    const styles = useStyleSheet(themedStyles);

    return (
        <ImageBackground
            style={styles.icon}
            source={require('../assets/icons/whatsapp.png')} >
            <View style={styles.view} />
        </ImageBackground>

    )
};

const themedStyles = StyleService.create({
    icon: {
        marginTop: 37,
        height: 24,
        width: 24,
        overlayColor: "transparent",
    },
    view: {
        overlayColor: "transparent",
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
});