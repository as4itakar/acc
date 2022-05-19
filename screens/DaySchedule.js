import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
    FlatList,
    ScrollView, Modal, Dimensions, Alert
} from 'react-native'
import {LinearGradient} from "expo-linear-gradient";
import {Card} from "react-native-shadow-cards";
import {AntDesign, Feather, Ionicons} from '@expo/vector-icons';
import {useEffect, useLayoutEffect, useState} from "react";
import {collection, getDocs, orderBy, query, addDoc, serverTimestamp, where} from "firebase/firestore";
import {auth, database} from "../config/firebase";
import {BarCodeScanner} from "expo-barcode-scanner";
import * as Location from "expo-location";



const DaySchedule = ({navigation, route}) =>{
    const [user, setUser] = useState([])
    const [locationBool, setLocationBool] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [teacherInit, setTeacherInit] = useState('')
    const [currentSubj, setCurrentSubj] = useState("")
    const [start, setStart] = useState(false)
    const [bottomFlex, setBottomFlex] = useState(new Animated.Value(1))
    const [subject, setSubject] = useState([])
    const [hasPermission, setHasPermission] =  useState(null)
    const [scanned, setScanned] = useState(false)
    const [text, setText] = useState('Not yet scanned')

    const askForCameraPermission = () =>{
        (async () =>{
            const {status} = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }

    const getUser = async () =>{
        const userCol = collection(database, 'users')
        const q = query(userCol, where('email', '==', auth.currentUser.email))
        const userSnap = await getDocs(q)
        setUser(userSnap.docs.map((doc)=>({...doc.data(), id: doc.id})))
    }

    const getSubject = async () =>{
        const subjectsCol = collection(database, 'subjects')
        const q = query(subjectsCol, orderBy('endHour', 'asc'))
        const subjectsSnap = await getDocs(q)
        setSubject(subjectsSnap.docs.map((doc)=>({...doc.data(), id: doc.id})))

    }

    const arePointsNear = (checkPoint, centerPoint, km) =>{
        const ky = 40000 / 360;
        const kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
        const dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
        const dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
        const altHighLimit = centerPoint.alt + 2
        const altLowLimit = centerPoint.alt - 2
        console.log(altHighLimit, altLowLimit)
        if (checkPoint.alt<=altHighLimit && checkPoint.alt>=altLowLimit){
            const res = Math.sqrt(dx * dx + dy * dy)
            const trueRes =parseFloat(res.toFixed(4))
            if (trueRes < parseFloat(km)){
                console.log('a')
                return true
            }else {
                console.log(false)
                console.log('s')
                return false
            }

        }else{
            console.log(false)
            console.log('d')
            return false
        }
    }

    const generateAttendance = async () =>{
        let {status} = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted'){
            setErrorMsg('Permission to access location was denied')
            return
        }

        let coords = await Location.getCurrentPositionAsync({})
        const latitude = JSON.stringify(coords.coords.latitude)
        const trueLat = parseFloat(latitude)
        const longitude = JSON.stringify(coords.coords.longitude)
        const trueLong = parseFloat(longitude)
        const altitude = JSON.stringify(coords.coords.altitude)
        const trueAlt = parseFloat(altitude)

        const centerPoint = {lat: 55.7416957, lng: 49.2121645, alt:127.5};
        const checkPoint = {lat: trueLat, lng: trueLong, alt: trueAlt};
        console.log(altitude)

        const res = arePointsNear(checkPoint, centerPoint, 0.01)
        console.log(res)

        if (scanned){
            if (text.split('.')[0] === teacherInit){
                if (res){
                    const attDoc = collection(database, 'requests')
                    await addDoc(attDoc, {date: serverTimestamp(), userName: user[0]?.fullName, name:currentSubj, userEmail:auth.currentUser.email})
                    setScanned(false)
                    setStart(false)
                    Alert.alert('^_^',"Вы успешно отсканировали QR-код!")
                }else{
                    Alert.alert('Ошибка', 'Вы не находитесь в кабинете!')
                }
            }else {
                Alert.alert('Ошибка', 'Данные QR-кода не верны!')
            }

        }
    }



    const handleClose = () =>{
        setStart(false)
        setHasPermission(false)
        setScanned(false)
        setTeacherInit('')
    }

    const handleBarCodeScanned = ({type, data}) =>{
        setScanned(true)
        setText(data)
    }

    useEffect(()=>{
        getSubject()
        getUser()
    }, [])

    const handleSubmit = async ({name, teacherName, startH, startM, endH, endM}) =>{
        const dateH = new Date().getHours()
        const dateM = new Date().getMinutes()
        const dayW = new Date().getDay()
        if (parseInt(route.params?.dayWeek) === parseInt(dayW.toString())){
            if (parseInt(dateH.toString()+dateM.toString())>=parseInt(startH.toString()+startM.toString()) && parseInt(dateH.toString()+dateM.toString())<=parseInt(endH.toString()+endM.toString())){
                setStart(true)
                setCurrentSubj(name)
                setTeacherInit(teacherName)
            }else if (parseInt(dateH.toString()+dateM.toString())<=parseInt(startH.toString()+startM.toString()) || parseInt(dateH.toString()+dateM.toString())>=parseInt(endH.toString()+endM.toString())){
                Alert.alert('Ошибка', 'Попробуйте в другое время ^_^')
            }
        }else {
            Alert.alert('Ошибка', 'Сейчас не '+route.params?.title+'!')
        }
    }



    useEffect(()=>{

        if (start){
            Animated.timing(bottomFlex, {
                toValue:4,
                duration:250,
                useNativeDriver:false,
                easing: Easing.linear,
            }).start()
        }else{
            Animated.timing(bottomFlex, {
                toValue:1,
                duration:250,
                useNativeDriver:false,
                easing: Easing.linear,
            }).start()
        }
    },[start])

    return(
        <SafeAreaView style={{
            flex:1
        }}>
            <LinearGradient style={{
                height:80,
                borderBottomLeftRadius:30,
                borderBottomRightRadius:30,
            }}
                            colors={['#72c2d9','#35a9ad', '#03958b']}>
                <View style={{
                    flex:1,
                    marginHorizontal:20,
                    justifyContent:'center'
                }}>
                    <TouchableOpacity activeOpacity={10} onPress={()=> navigation.navigate('ScheduleScreen')}>
                        <AntDesign name="leftcircleo" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
            <Card style={{
                width:160,
                height:30,
                marginVertical:-15,
                alignSelf:'center',
                alignItems:'center',
                justifyContent:'center'
            }}>
                <Text>{route.params?.title}</Text>
            </Card>
            <View style={{
                flex:1
            }}>
                <View style={{
                    flex:1,
                    marginTop:20,
                    alignItems:'center'
                }}>
                    <FlatList data={subject.filter((item)=>item.day === route.params?.title)} renderItem={({item})=>(
                        <TouchableOpacity activeOpacity={10} onPress={()=>handleSubmit({name:item.name, teacherName: item.teacher, startH: item.startHour, startM: item.startMinute, endH:item.endHour, endM:item.endMinute})}>
                            <Card style={{
                                height:100,
                                marginVertical:10,
                                marginHorizontal:5
                            }}>
                                <View style={{
                                    flex:1,
                                    marginHorizontal:10,
                                    flexDirection:'row',
                                    justifyContent:'space-between',
                                    alignItems:'center'
                                }}>
                                    <View style={{
                                        flex:1,
                                        alignItems:'flex-start'
                                    }}>
                                        <Text>{item.name}</Text>
                                    </View>
                                    <View style={{
                                        flex:1,
                                        alignItems:'flex-end'
                                    }}>
                                        <Text>С {item?.startHour}:{item?.startMinute} до {item?.endHour}:{item?.endMinute}</Text>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    )}/>

                </View>
                <Animated.View style={[style.container, {flex:bottomFlex}]}>
                    {start?
                        <Card style={{
                            flex:1,
                            marginHorizontal:20,
                            borderColor:'black',
                            borderWidth:2,
                            borderTopLeftRadius:30,
                            borderTopRightRadius:30,


                        }}>
                            {hasPermission === null || hasPermission === false?
                                <View style={{
                                    height:400,
                                    alignItems:'center',
                                    justifyContent:'center'
                                }}>
                                    <Text style={{
                                        marginBottom:10
                                    }}>{currentSubj}</Text>
                                    <Text>С 14:00 до 17:00</Text>
                                </View>:
                                <View style={{
                                    height:400,
                                    alignItems:'center',
                                    justifyContent:'center'
                                }}>
                                    <BarCodeScanner onBarCodeScanned={scanned? undefined :handleBarCodeScanned}
                                                    style={{height:350, width: 350, borderRadius: 10}}/>
                                    {scanned?
                                        <Text>Выуспешно отсканировали QR-код!</Text>:
                                        <Text>Отсканируйте QR-код...</Text>
                                    }
                                </View>
                            }
                            <View style={{
                                height: 80,
                                alignItems:'center',
                                justifyContent:'center',

                            }}>
                                {hasPermission === false || hasPermission === null?
                                    <TouchableOpacity onPress={askForCameraPermission} style={{
                                        width:120,
                                        height:30,
                                        backgroundColor:'#f48d3c',
                                        alignItems:'center',
                                        justifyContent:'center',
                                        borderRadius:20,
                                        marginBottom:10
                                    }}>
                                        <Text style={{
                                            color:'white',
                                        }}>Отметиться</Text>
                                    </TouchableOpacity>
                                    :
                                    scanned &&
                                    <View style={{
                                        flexDirection:'row',
                                        alignItems:'center'
                                    }}>
                                        <TouchableOpacity onPress={()=>setScanned(false)} style={{
                                            borderRadius:40,
                                            width:30,
                                            height:30,
                                            backgroundColor:'#f48d3c',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            marginBottom:10,
                                            marginRight:10
                                        }}>
                                            <Ionicons name="reload" size={20} color="white" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={generateAttendance} style={{
                                            borderRadius:40,
                                            width:30,
                                            height:30,
                                            backgroundColor:'#f48d3c',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            marginBottom:10,
                                        }}>
                                            <Feather name="check" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                }

                                <TouchableOpacity onPress={handleClose} style={{
                                    borderRadius:40,
                                    width:30,
                                    height:30,
                                    backgroundColor:'#f48d3c',
                                    alignItems:'center',
                                    justifyContent:'center',
                                }}>
                                    <AntDesign name="close" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </Card>:
                                null}
                </Animated.View>
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:500,
        bottom:-5,
        left:0,
        right:0,

    },
    modal:{
        backgroundColor:'white',
        borderRadius:10,
    }
})

export default DaySchedule