import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    SafeAreaView,
    Image,
    Modal,
    Platform,
    Animated,
    Easing, Alert
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Card} from "react-native-shadow-cards";
import {Feather, Ionicons} from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, {G, Circle} from "react-native-svg";
import {useEffect, useState} from "react";
import {auth, database} from "../config/firebase";
import {signOut} from 'firebase/auth'
import * as Location from 'expo-location'

import * as ImagePicker from 'expo-image-picker'
import {collection, getDocs, query, where, updateDoc, doc, orderBy} from "firebase/firestore";
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {storage} from "../config/firebase";



const Profile = ({navigation}) =>{
    const [procRes, setProcRes] = useState(0)
    const [attendance, setAttendance] = useState([])
    const [attCount, setAttCount] = useState([])
    const options = [{name:'Январь', flow:1},{name:'Февраль', flow:2},{name:'Март', flow:3},{name:'Апрель', flow:4},{name:'Май', flow:5},{name:'Сентябрь', flow:9},{name:'Октябрь', flow:10},{name:'Ноябрь', flow:11},{name:'Декабрь', flow:12}]
    const [upl, setUpl] = useState(false)
    const [degrees, setDegrees] = useState(null)
    const [bottomFlex, setBottomFlex] = useState(new Animated.Value(1))
    const [start, setStart] = useState(false)
    const [image, setImage] = useState(null)
    const [user, setUser] = useState([])
    const size = 180
    const strokeWidth = 10
    const center = size / 2
    const radius = size / 2 - strokeWidth / 2
    const circumference = 2 * Math.PI * radius
    const [reload, setReload] = useState(true)



    const handleSignOut = () =>{
        signOut(auth).catch(error => console.log(error))
    }


    const handleReload = ()=>{
        setReload(true)
    }

    useEffect(()=>{

        if (start){
            Animated.timing(bottomFlex, {
                toValue:4,
                duration:100,
                useNativeDriver:false,
                easing: Easing.linear,
            }).start()
        }else{
            Animated.timing(bottomFlex, {
                toValue:1,
                duration:100,
                useNativeDriver:false,
                easing: Easing.linear,
            }).start()
        }
    },[start])

    const getProcAtt = async () =>{
        const MONTH = new Date().getMonth()+1
        const YEAR = new Date().getFullYear()
        let count = 0
        const monthCol = collection(database, 'months')
        const q = query(monthCol, orderBy('flow', 'asc'))
        const monthSnap = await getDocs(q)
        const mon = monthSnap.docs.map((doc)=>({...doc.data(), id:doc.id}))
        console.log(mon)
        mon.map((item)=>{
            if (item.flow<MONTH){

            }else if (item.flow>=MONTH){
                count = count + parseInt(item.lessons)
            }
        })
        const yearAtt = attendance.filter((item) => item.year === YEAR)
        const res = yearAtt.length / count * 100
        setProcRes(res)
        setReload(false)

    }



    const getAttendance = async () =>{
        const attendanceCol = collection(database, 'attendance')
        const q = query(attendanceCol, orderBy('date', 'desc'))
        const attendanceSnap = await getDocs(q)
        const att = attendanceSnap.docs.map((doc)=>({...doc.data(), necDate: doc.data().date.seconds * 1000, day:new Date(doc.data().date.seconds * 1000).getDate(), month: new Date(doc.data().date.seconds * 1000).getMonth()+1, year:new Date(doc.data().date.seconds * 1000).getFullYear(), hours:new Date(doc.data().date.seconds * 1000).getHours(),minutes:new Date(doc.data().date.seconds * 1000).getMinutes(),id: doc.id}))
        const necessaryAttendance = att.filter((item)=>item.user === auth.currentUser.email)
        setAttendance(necessaryAttendance)
        const counting = []
        options.map((opt) =>{
            let count = 0
            necessaryAttendance.map((att) => {
                if (opt.flow === att.month){
                    count = count + 1
                }
            })
            counting.push(count)
        })
        setAttCount(counting)



    }

    useEffect(()=>{
        getProcAtt()
    }, [attendance])

    const getUser = async () =>{
        const userCol = collection(database, 'users')
        const q = query(userCol, where('email', '==', auth.currentUser.email))
        const userSnap = await getDocs(q)
        setUser(userSnap.docs.map((doc)=>({...doc.data(), id: doc.id})))
    }

    useEffect(()=>{
        getUser()
        getAttendance()
    },[upl, reload])



    useEffect( async () => {
        if (Platform.OS !== 'web'){
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (status !== 'granted'){
                alert('Permission denied!')
            }
        }
    },[])

    const PickImage = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })
        if (!result.cancelled){
            setImage(result.uri)
        }
    }

    const SubmitPic = async () =>{
        const lastName = new Date().getTime() + 'image' + Math.random() * 100
        const imgR = ref(storage, lastName)
        const img = await fetch(image)
        const bytes = await img.blob()
        const uploadTask = uploadBytesResumable(imgR, bytes)

        uploadTask.on('state_changed',
            (snapshot)=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setDegrees(progress)
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break
                case 'running':
                    console.log('Upload is running')
                    break
            }
            },
            (error)=>{

            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    const userDoc = doc(database, 'users', user[0]?.id)
                    const newField = {img: downloadURL}
                    await updateDoc(userDoc, newField)
                    setImage(null)
                    setUpl(true)
                })
            })
    }

    return(
        <SafeAreaView style={{flex: 1}}>
            <LinearGradient style={{
                height:200,
                borderBottomLeftRadius:30,
                borderBottomRightRadius:30,
            }}
                            colors={['#72c2d9','#35a9ad', '#03958b']}>
                <View style={{
                    flex:1,
                    marginVertical:10,
                    marginHorizontal:10,
                    flexDirection:'row'
                }}>
                    <View style={{
                        flex:1,
                        alignItems:'center',
                        justifyContent:'center',
                    }}>
                        <Image source={{uri:user[0]?.img}} style={{
                            width:'80%',
                            height:'80%',
                            borderRadius:10,
                            borderColor:'white',
                            borderWidth:2,

                        }}/>
                    </View>
                    <View style={{
                        flex:2,
                        justifyContent:'center',
                        alignItems:'center'
                    }}>
                        <View style={{
                            width:'80%',
                            height:'80%'
                        }}>
                            <View style={{
                                width:'100%',
                                height:25,
                                flexDirection:'row',
                                alignItems:'center'
                            }}>
                                <Feather name="user" size={20} color="white" />
                                <Text style={{color:'white'}}>{user[0]?.surname} {user[0]?.name}</Text>
                            </View>
                            <View style={{
                                width:'100%',
                                height:25,
                                flexDirection:'row',
                                alignItems:'center'
                            }}>
                                <AntDesign name="team" size={20} color="white" />
                                <Text style={{color:'white'}}>Группа {user[0]?.group}</Text>
                            </View>
                            <View style={{
                                width:'100%',
                                height:25,
                                flexDirection:'row',
                                alignItems:'center'

                            }}>
                                <EvilIcons name="pencil" size={20} color="white" />
                                <Text style={{color:'white'}}>Форма обучения: {user[0]?.study}</Text>
                            </View>
                            <View style={{
                                width:'100%',
                                height:25,
                                flexDirection:'row',
                                alignItems:'center'
                            }}>
                                <AntDesign name="enviromento" size={20} color="white" />
                                <Text style={{color:'white'}}>{user[0]?.country}, {user[0]?.city}</Text>
                            </View>
                            <View style={{
                                width:'100%',
                                height:25,
                                flexDirection:'row',
                                alignItems:'center'
                            }}>
                                <AntDesign name="phone" size={20} color="white" />
                                <Text style={{color:'white'}}>{user[0]?.phone}</Text>
                            </View>
                            <View style={{
                                width:'100%',
                                height:25,
                                flexDirection:'row',
                                alignItems:'center'
                            }}>
                                <Feather name="mail" size={20} color="white" />
                                <Text style={{color:'white'}}>{user[0]?.email}</Text>
                            </View>
                        </View>
                    </View>

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
                <Text>Профиль</Text>
            </Card>
            <View style={{
                flex:1
            }}>
                <View style={{
                    flex:1,
                    marginTop:30,
                    alignItems:'center'
                }}>
                    <TouchableOpacity style={{flex:1}} activeOpacity={10} onPress={()=>navigation.navigate('AttendanceScreen', {attendance, attCount}) }>
                        <Card style={{
                            flex:1,
                            marginHorizontal:15
                        }}>
                            <View style={{
                                height:50,
                                borderBottomColor:'lightgray',
                                borderBottomWidth:1,
                                justifyContent:'center',
                                alignItems:'center'
                            }}>
                                <Text>Посещаемость</Text>
                            </View>
                            <View style={{
                                flex:1,
                                marginVertical:10,
                                marginHorizontal:10,
                                justifyContent:'center',
                                alignItems:'center'
                            }}>
                                <Svg width={size} height={size}>
                                    <G rotation="-90" origin={center}>
                                        <Circle
                                            stroke="#72c2d9"
                                            cx={center}
                                            cy={center}
                                            r={radius}
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={circumference}
                                            strokeDashoffset={circumference - (circumference * procRes.toFixed(2)) / 100}
                                        />
                                    </G>
                                </Svg>
                                <Text style={{
                                    position:'absolute',
                                    justifyContent:'center',
                                    alignItems:'center',
                                    fontSize:50
                                }}>{procRes.toFixed(2)}%</Text>
                            </View>
                            <TouchableOpacity onPress={handleReload} style={{
                                position: 'absolute',
                                bottom: 0,
                                borderRadius:40,
                                backgroundColor:'#72c2d9',
                                justifyContent:'center',
                                alignItems: 'center',
                                right:0,
                                marginBottom:10,
                                marginRight:10,
                                width: 40,
                                height: 40
                            }}>
                                <Ionicons name="reload" size={24} color="white" />
                            </TouchableOpacity>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={10} onPress={()=>setStart(true)}>
                        <Card style={{
                            height:40,
                            marginHorizontal:15,
                            marginVertical:10,
                            justifyContent:'center',
                            alignItems:'center',
                            flexDirection:'row'
                        }}>
                            <FontAwesome5 style={{marginRight:5}} name="user-edit" size={20} color="black" />
                            <Text>Редактировать</Text>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={10} onPress={handleSignOut}>
                        <Card style={{
                            height:40,
                            marginHorizontal:15,
                            marginBottom:10,
                            justifyContent:'center',
                            alignItems:'center',
                            flexDirection:'row'
                        }}>
                            <FontAwesome5 style={{marginRight:5}} name="door-open" size={20} color="black" />
                            <Text>Выйти</Text>
                        </Card>
                    </TouchableOpacity>
                </View>
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
                        <View style={{
                            flex:1,
                            alignItems: 'center',

                        }}>
                            <View style={{

                                height:50,
                                width:"100%",
                                justifyContent:'center',
                                alignItems: 'center',
                                backgroundColor:'#72c2d9',
                                borderTopRightRadius:29,
                                borderTopLeftRadius:29

                            }}>
                                <Text>Выберите изображение</Text>
                            </View>
                            <View style={{
                                width:'100%',
                                height: 200,
                                justifyContent:'center',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    borderRadius:20,
                                    height: 150,
                                    width: 100,
                                    borderColor:'black',
                                    borderWidth:2
                                }}>
                                    {image !== null ? <Image source={{uri:image}} style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius:19
                                    }}/>:
                                        <Image source={{uri:user[0]?.img}} style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius:18
                                        }}/>}

                                </View>
                                {degrees === null || degrees === 100?
                                    null:
                                    <View style={{marginTop:5}}>
                                        <Text>Изображение грузится</Text>
                                    </View>
                                }
                            </View>
                            <View style={{
                                position:'absolute',
                                bottom:0,
                                right:0,
                                left:0,
                                width: '100%',
                                height: 50,
                                justifyContent:'space-between',
                                flexDirection:'row',
                                alignItems: 'center'
                            }}>
                                <TouchableOpacity onPress={PickImage} style={{
                                    borderRadius:40,
                                    marginHorizontal:10,
                                    width:40,
                                    height:40,
                                    backgroundColor:'#f48d3c',
                                    alignItems:'center',
                                    justifyContent:'center',
                                }}>
                                    <AntDesign name="picture" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>setStart(!start)} style={{
                                    borderRadius:40,
                                    width:40,
                                    height:40,
                                    marginHorizontal:10,
                                    backgroundColor:'#f48d3c',
                                    alignItems:'center',
                                    justifyContent:'center',
                                }}>
                                    <AntDesign name="close" size={20} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={SubmitPic} style={{
                                    borderRadius:40,
                                    marginHorizontal:10,
                                    width:40,
                                    height:40,
                                    backgroundColor:'#f48d3c',
                                    alignItems:'center',
                                    justifyContent:'center',
                                }}>
                                    <MaterialCommunityIcons name="check" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Card>:
                    null}
            </Animated.View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:300,
        bottom:-5,
        left:0,
        right:0,
        alignItems:'center'
    }
})

export default Profile

