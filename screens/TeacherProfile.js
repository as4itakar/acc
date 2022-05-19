import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Easing
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {collection, getDocs, query, where} from "firebase/firestore";
import {auth, database} from "../config/firebase";
import {useEffect, useState} from "react";
import {AntDesign, Feather, FontAwesome5} from "@expo/vector-icons";
import { SimpleLineIcons } from '@expo/vector-icons';
import {Card} from "react-native-shadow-cards";
import {signOut} from "firebase/auth";
import QRCode from "react-native-qrcode-svg";




const TeacherProfile = () =>{
    const [qrValue, setQrValue] = useState('')
    const [start, setStart] = useState(false)
    const [user, setUser] = useState([])
    const [bottomFlex, setBottomFlex] = useState(new Animated.Value(1))

    const handleSignOut = () =>{
        signOut(auth).catch(error => console.log(error))
    }

    const getUser = async () =>{
        const userCol = collection(database, 'users')
        const q = query(userCol, where('email', '==', auth.currentUser.email))
        const userSnap = await getDocs(q)
        setUser(userSnap.docs.map((doc)=>({...doc.data(), id: doc.id})))
    }


    useEffect(()=>{
        getUser()
    },[])

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

    const generateQr = () =>{
        setStart(true)

        if (qrValue === ''){
            setQrValue(user[0].fullName + '.' + Math.random() * 100)
        }


    }

    return(
        <SafeAreaView style={{flex:1}}>
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
                                height:30,
                                flexDirection:'row',
                                alignItems:'center'
                            }}>
                                <Feather style={{marginRight:5}} name="user" size={20} color="white" />
                                <Text style={{color:'white'}}>{user[0]?.name} {user[0]?.patronymic}</Text>
                            </View>
                            {
                                user[0]?.birth?
                                    <View style={{
                                        width:'100%',
                                        height:30,
                                        flexDirection:'row',
                                        alignItems:'center'
                                    }}>
                                        <SimpleLineIcons style={{marginRight:5}} name="present" size={20} color="white" />
                                        <Text style={{color:'white'}}>{user[0]?.birth}</Text>
                                    </View>:
                                    null
                            }
                            <View style={{
                                width:'100%',
                                height:30,
                                flexDirection:'row',
                                alignItems:'center'
                            }}>
                                <Feather style={{marginRight:5}} name="mail" size={20} color="white" />
                                <Text style={{color:'white'}}>{user[0]?.email}</Text>
                            </View>
                            {user[0]?.phone?
                                <View style={{
                                    width:'100%',
                                    height:30,
                                    flexDirection:'row',
                                    alignItems:'center'
                                }}>
                                    <AntDesign style={{marginRight:5}} name="phone" size={20} color="white" />
                                    <Text style={{color:'white'}}>{user[0]?.phone}</Text>
                                </View>:
                                        null}
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
                <Card style={{
                    alignSelf:'center',
                    marginHorizontal:40,
                    marginTop:30,
                    flex:1,
                    borderRadius:40,
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{
                        width:'80%',
                        height:'80%',
                        marginHorizontal:20,
                        marginVertical:20
                    }}>
                        {user[0]?.institute &&
                            <View style={{
                            marginVertical:10,
                            width:'100%',
                            height:40,
                            justifyContent:'center',
                            marginBottom:15
                        }}>
                            <Text style={{marginBottom:5, fontWeight:'bold'}}>Институт</Text>
                            <Text style={{color:'black', marginLeft:10}}>{user[0]?.institute}</Text>
                        </View>
                        }
                        {
                            user[0]?.depart &&
                            <View style={{
                                marginVertical:10,
                                width:'100%',
                                height:40,
                                justifyContent:'center',
                                marginBottom:15
                            }}>
                                <Text style={{marginBottom:5, fontWeight:'bold'}}>Кафдера</Text>
                                <Text style={{color:'black', marginLeft:10}}>{user[0]?.depart}</Text>
                            </View>
                        }
                        {
                            user[0]?.position &&
                            <View style={{
                                marginVertical:10,
                                width:'100%',
                                height:40,
                                justifyContent:'center',
                                marginBottom:15
                            }}>
                                <Text style={{marginBottom:5, fontWeight:'bold'}}>Должность</Text>
                                <Text style={{color:'black', marginLeft:10}}>{user[0]?.position}</Text>
                            </View>
                        }
                        {
                            user[0]?.degree &&
                            <View style={{
                                marginVertical:10,
                                width:'100%',
                                height:40,
                                justifyContent:'center',
                                marginBottom:15
                            }}>
                                <Text style={{marginBottom:5, fontWeight:'bold'}}>Ученая степень</Text>
                                <Text style={{color:'black', marginLeft:10}}>{user[0]?.degree}</Text>
                            </View>
                        }

                    </ScrollView>
                </Card>
                <TouchableOpacity activeOpacity={10} onPress={()=>setStart(true)}>
                    <Card style={{
                        height:40,
                        marginHorizontal:20,
                        marginVertical:10,
                        justifyContent:'center',
                        alignItems:'center',
                        flexDirection:'row'
                    }}>
                        <FontAwesome5 style={{marginRight:5}} name="user-edit" size={20} color="black" />
                        <Text>Редактировать</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={10} onPress={generateQr}>
                    <Card style={{
                        height:40,
                        marginHorizontal:20,
                        justifyContent:'center',
                        alignItems:'center',
                        flexDirection:'row',
                        marginBottom:10
                    }}>
                        <AntDesign name="qrcode" size={20} color="black" />
                        <Text>QR-код</Text>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={10} onPress={handleSignOut}>
                    <Card style={{
                        height:40,
                        marginHorizontal:20,
                        marginBottom:10,
                        justifyContent:'center',
                        alignItems:'center',
                        flexDirection:'row',

                    }}>
                        <FontAwesome5 style={{marginRight:5}} name="door-open" size={20} color="black" />
                        <Text>Выйти</Text>
                    </Card>
                </TouchableOpacity>

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
                        <View style={{flex:1, marginHorizontal:10, marginVertical:20, justifyContent:'center', alignItems: 'center'}}>
                            <QRCode
                                value={qrValue}
                                size={290}
                                color='black'
                                backgroudColor='white'
                            >

                            </QRCode>
                        </View>
                        <View style={{
                            height: 50,
                            alignItems:'center',
                            justifyContent:'center',
                        }}>
                            <TouchableOpacity onPress={()=>setStart(false)} style={{
                                borderRadius:40,
                                width:35,
                                height:35,
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
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:400,
        bottom:-5,
        left:0,
        right:0,
        alignItems:'center'
    }
})

export default TeacherProfile