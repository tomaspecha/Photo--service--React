import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, SafeAreaView, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import PhotoEditor from './components/PhotoEditor';
import ScaledImage from './components/ScaledImage';
import { Photo, addPhoto, getPhotos, registerUser } from './libraries/PhotoService';

const App = () => {
    const [photos, setPhotos] = useState<Array<Photo>>([]);
    const [user, setUser] = useState("");
    const [camera, setCamera] = useState<Camera | null>(null);
    const [cameraStarted, setCameraStarted] = useState(false);
    const [cameraAction, setCameraAction] = useState("Start Camera");
    const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    // Convert file URI to base64
    const convertToBase64 = async (uri: string): Promise<string | null> => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return `data:image/jpeg;base64,${base64}`;
        } catch (error) {
            Alert.alert("Error", "Failed to convert image to base64.");
            return null;
        }
    };

    // Handle photo selection from the library
    const handlePhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Denied", "Please enable media library permissions to select a photo.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto({
                uri: result.assets[0].uri,
                width: result.assets[0].width,
                height: result.assets[0].height,
            });
        }
    };

    // Fetch photos from the service
    const updatePhotos = async () => {
        setLoading(true);
        try {
            const p = await getPhotos(user);
            setPhotos(p);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch photos. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Register a user on the service
    const register = async () => {
        if (!user.trim()) {
            Alert.alert("Error", "Please enter a username.");
            return;
        }

        setLoading(true);
        try {
            await registerUser(user);
            Alert.alert("Success", "User registered successfully.");
        } catch (error) {
            Alert.alert("Error", "Failed to register user. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Start the camera
    const startCamera = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status === 'granted') {
            setCameraStarted(true);
            setCameraAction("Take Photo");
        } else {
            Alert.alert("Access Denied", "Camera permissions are required.");
        }
    };

    // Fetch the user's location
    useEffect(() => {
        const fetchLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location permissions are required.");
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            const reverseGeo = await Location.reverseGeocodeAsync({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });

            if (reverseGeo.length > 0) {
                const addr = reverseGeo[0];
                setLocation(`${addr.street}, ${addr.city}, ${addr.region}, ${addr.country}`);
            } else {
                setLocation("No address found for this location.");
            }
        };

        void fetchLocation(); // Explicitly mark as non-awaited in `useEffect`
    }, []);

    // Take a photo using the camera
    const takePicture = async () => {
        if (!camera) return;
        const p = await camera.takePictureAsync();
        setPhoto(p);
        setCameraStarted(false);
        setCameraAction("Start Camera");
    };

    // Change camera button action
    const cameraButton = async () => {
        if (cameraStarted) {
            await takePicture(); // Await the promise to ensure it's handled
        } else {
            await startCamera(); // Await the promise to ensure it's handled
        }
    };

    // Submit the photo and location
    const submitEntry = async () => {
        if (!photo) {
            Alert.alert("Error", "No photo selected.");
            return;
        }
        if (!user.trim()) {
            Alert.alert("Error", "Please enter a username.");
            return;
        }

        const base64Uri = await convertToBase64(photo.uri);
        if (!base64Uri) return;

        try {
            await addPhoto(user, base64Uri, location);
            Alert.alert("Success", "Entry submitted successfully.");
        } catch (error) {
            Alert.alert("Error", "Failed to submit entry. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Welcome to the photo competition</Text>
            <Text style={styles.text}>Please enter your name</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={setUser}
                value={user}
            />
            <Text style={styles.text}>Location</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={setLocation}
                value={location}
            />
            <Button title="Register" onPress={register} />
            <Text style={styles.text}>Take a photo</Text>
            {cameraStarted ? (
                <Camera
                    style={styles.camera}
                    type={CameraType.back}
                    ref={(r) => setCamera(r)}
                />
            ) : (
                <ScaledImage uri={photo?.uri || ''} width={Dimensions.get('window').width} />
            )}
            <Button title={cameraAction} onPress={cameraButton} />
            <Button title="Pick an Image" onPress={handlePhoto} />
            <Button title="Submit Entry" onPress={submitEntry} />
            <Button title="View Entries" onPress={updatePhotos} />
            <Text style={styles.text}>Entries</Text>
            {loading ? (
                <Text style={styles.text}>Loading...</Text>
            ) : (
                photos.map((photo, index) => (
                    <View key={index} style={{ marginBottom: 5 }}>
                        <Text>Photo ID: {photo.id}</Text>
                        <PhotoEditor photo={photo} user={user} />
                    </View>
                ))
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    camera: {
        flex: 1,
        minHeight: 200,
    },
    text: {
        fontWeight: 'bold',
        marginVertical: 5,
    },
    textInput: {
        fontSize: 16,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        borderRadius: 5,
    },
});

export default App;
