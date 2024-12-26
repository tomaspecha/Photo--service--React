import React, { useState, useEffect } from "react";
import { Image } from "react-native";

/**
 * The properties of the ScaledImage component.
 *
 * uri: the URI of the image (can be a local image or base64 encoded image data)
 * width: the desired width of the image
 * height: the desired height of the image
 */
type ScaledImageProps = {
    uri?: string;
    width?: number;
    height?: number;
};

/**
 * A React Native component that displays an image and scales it to fit the screen.
 * If the width or height is not set, the image will be displayed at its natural size.
 * If both the width and height are set, the image will be displayed at the specified size.
 * If only the width or height is set, the image will be scaled to fit the specified size.
 *
 * @param props The properties of the component. See ScaledImageProps.
 * @returns A React Native component.
 */
export default function ScaledImage(props: ScaledImageProps) {
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [imageUri, setImageUri] = useState<string | undefined>("");

    useEffect(() => {
        if (props.uri && props.uri !== imageUri) {
            setImageUri(props.uri);

            // Get the size of the image.
            Image.getSize(
                props.uri,
                (originalWidth, originalHeight) => {
                    if (props.width && !props.height) {
                        // Scale based on width.
                        const scaledHeight = originalHeight * (props.width / originalWidth);
                        setImageSize({ width: props.width, height: scaledHeight });
                    } else if (!props.width && props.height) {
                        // Scale based on height.
                        const scaledWidth = originalWidth * (props.height / originalHeight);
                        setImageSize({ width: scaledWidth, height: props.height });
                    } else {
                        // Use natural size if both width and height are undefined.
                        setImageSize({ width: originalWidth, height: originalHeight });
                    }
                },
                () => {
                    console.error("Failed to load image at URI:", props.uri);
                }
            );
        }
    }, [props.uri, props.width, props.height]);

    // Render nothing if the image is not ready.
    if (!imageUri || imageSize.width === 0 || imageSize.height === 0) {
        return null;
    }

    // Render the scaled image.
    return (
        <Image
            source={{ uri: imageUri }}
            style={{ width: imageSize.width, height: imageSize.height }}
        />
    );
}
