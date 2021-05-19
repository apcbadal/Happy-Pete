import React, { Component } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Alert,
    TouchableOpacity,
    TextInput, FlatList,
    TouchableHighlight,
    Image
} from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons';
import * as geolib from "geolib";
import { watchPositionAsync } from "expo-location";
export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bar: [],
            latitude: 0,
            longitude: 0,
            coordinates: [],
            data: this.props.children
        };

    }
    componentDidMount() {
        this.getGeoLocation()

    }


    render() {

        return (
            <View style={styles.mapContainer}>
                <MapView
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    followsUserLocation={true}
                    userLocationPriority={"high"}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.100,
                        longitudeDelta: 0.0121,
                    }}

                >
                    <Marker
                        coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                        title={"Your Location"}

                    />
                    {this.state.bar.map((val, index) => {
                        return (<MapView.Marker
                            coordinate={{
                                latitude: val.latitude,
                                longitude: val.longitude
                            }}
                            key={index}
                            title={val.title}
                        />);
                    })}

                </MapView>

                <View style={styles.buttonContainer}>
                    <View style={styles.locationIcon}>
                        <TouchableHighlight underlayColor="" onPress={() => { this.getGeoLocation() }}>
                            <Image style={styles.location} source={require("../assets/icons/location.png")} />

                            {/* <Ionicons name="locate" size={24} color="blue" /> */}
                        </TouchableHighlight>
                    </View>

                    <View style={styles.zoomInOutContainer}>

                        <View>
                            <TouchableHighlight onPress={() => { this.getGeoLocation() }} underlayColor="" >
                                <View style={styles.zoomInButton}>
                                    <Image style={styles.zoomInIcon} source={require("../assets/icons/homescreen/minus.png")} />
                                </View>
                            </TouchableHighlight>
                        </View>

                        <View>
                            <TouchableHighlight onPress={() => { this.getGeoLocation() }} underlayColor="">
                                <View style={styles.zoomOutButton}>
                                    <Image style={styles.zoomOutIcon} source={require("../assets/icons/homescreen/add.png")} />
                                </View>
                            </TouchableHighlight>
                        </View>

                    </View>
                </View>
            </View>
        )
    }

    getGeoLocation() {
        let barList = this.state.data
        navigator.geolocation = require('@react-native-community/geolocation');
        navigator.geolocation.getCurrentPosition(
            position => {
                let bar = []
                for (let i in barList) {
                    let dis = geolib.getDistance(position.coords, {
                        latitude: barList[i].latitude,
                        longitude: barList[i].longitude,
                    })
                    let disKM = dis / 1000;
                    if (disKM <= 20) {
                        bar.push({
                            name: barList[i].title,
                            // avatar_url:list[i].avatar_url,
                            website: barList[i].website,
                            longitude: barList[i].longitude,
                            latitude: barList[i].latitude,
                            phoneNumber: barList[i].phoneNumber,
                            address: barList[i].address,
                            drinkMenu: barList[i].drinkMenu,
                            foodMenu: barList[i].foodMenu,
                            happyHour: barList[i].happyHour
                        })
                    }
                }
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    coordinates: this.state.coordinates.concat({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }),
                    bar: bar
                });
            },
            error => {
                Alert.alert(error.message.toString());
            },
            {
                showLocationDialog: true,
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 10
            }
        );
    }

}
const styles = StyleSheet.create({
    buttonContainer:{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        bottom:0,
        right:0,
        marginHorizontal:10,
    },
    zoomInOutContainer: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: "100%",
        marginVertical: 20,

    },
    zoomInButton: {
        backgroundColor: "white",
        padding: 10,
        marginRight: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,
    },
    zoomInIcon: {
        height: 15,
        width: 15,
        resizeMode: "contain",
    },
    zoomOutButton: {
        backgroundColor: "white",
        padding: 10,
        marginRight: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,

    },
    zoomOutIcon: {
        height: 15,
        width: 15,
        resizeMode: "contain",
    },

    locationIcon: {
        // marginTop: '60%',
        // marginLeft: '77%',
        backgroundColor: 'white',
        padding: 9,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 6,
    },
    location: {
        width: 30,
        resizeMode: "contain",
        height: 30,
    },
    mapcontainer: {
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        display: 'none',
        ...StyleSheet.absoluteFillObject,
    },
    mapContainer: {

        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 15,
        borderColor: 'white',
        borderWidth: 2,
        overflow: 'hidden',
        height: 350,
        width: "110%",
        // width: "117%",
        marginLeft: 15,
    },

})
