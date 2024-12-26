/**
 * A react native component that shows a Photo and allows votes to be made.
 * It does not currently support the ability to add comments to the photo,
 * but this could be added in the future.
 *
 * Comments can be viewed.
 *
 * Note that this requires the comments to be formatted as an array of strings.
 *
 * Version history
 * 1.0, 18 January 2024, A Thomson, Intial version
 * 1.1, 27 February 2024, A Thomson, Updated following feedback
 */
import { Text, TextInput, Button, View, StyleSheet, Dimensions, Alert } from 'react-native';
import ScaledImage from './ScaledImage';
import React, { useState, useEffect } from 'react';
import { Photo } from '../libraries/PhotoService';
import { addVote } from '../libraries/PhotoService';

type PhotoEditorProps = {
    photo: Photo;
    user: string;
};

/**
 * A React Native component that shows a Photo and allows comments and votes to be added.
 *
 * @param props The properties of the component.
 * @returns     A React Native component.
 */
export default function PhotoEditor(props: PhotoEditorProps) {
    // State variables to hold the data entered by the user.
    const [votes, setVotes] = useState(props.photo.votes);
    const [voting, setVoting] = useState(false); // To disable voting button while processing

    // Update the votes when the photo changes.
    useEffect(() => {
        setVotes(props.photo.votes);
    }, [props.photo]);

    // Handle the vote action with error handling.
    const handleVote = async () => {
        setVoting(true);
        try {
            await addVote(props.user, props.photo.id);
            setVotes((prevVotes) => prevVotes + 1);
        } catch (error) {
            Alert.alert("Error", "Failed to cast vote. Please try again.");
        } finally {
            setVoting(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScaledImage uri={props.photo.uri} width={Dimensions.get('window').width} />
            <Text style={styles.text}>
                {props.photo.location} by {props.photo.user}
            </Text>
            {props.photo.comments.map((comment, index) => (
                <Text style={styles.text} key={`${props.photo.id}-comment-${index}`}>
                    {comment}
                </Text>
            ))}
            <View style={styles.horizontal}>
                <Button title="Vote" onPress={handleVote} disabled={voting} />
                <Text style={styles.text}>Votes: {votes}</Text>
            </View>
        </View>
    );
}

// Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        width: '100%',
    },
    text: {
        fontSize: 14,
        marginVertical: 4,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        marginVertical: 10,
    },
});
