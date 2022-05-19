import {View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList} from "react-native";
import {EvilIcons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {Card} from "react-native-shadow-cards";
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {auth, database} from "../config/firebase";
import {useEffect, useLayoutEffect, useState} from "react";
import TeacherScheduleComp from "../components/TeacherScheduleComp";
import ScheduleComponent from "../components/ScheduleComponent";



const TeacherSchedule = ({navigation}) =>{
    const [schedule, setSchedule] = useState([])
    const [subject, setSubject] = useState([])
    const [user, setUser] = useState([])

    useLayoutEffect(()=>{
        getUser()
        getSchedule()
    }, [])

    const getUser = async () =>{
        const usersCol = collection(database, 'users')
        const q = query(usersCol, where("email", "==", auth.currentUser.email))
        const userSnap = await getDocs(q)
        const trueUser = userSnap.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setUser(trueUser)
        console.log(user)
    }

    const getSchedule = async () =>{
        const scheduleCol = collection(database, 'days')
        const q = query(scheduleCol, orderBy('flow', 'asc'))
        const scheduleSnap = await getDocs(q)
        const allSchedule = scheduleSnap.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setSchedule(allSchedule)
    }


    const image = {uri: "https://sun9-74.userapi.com/s/v1/if2/H2zfkH2Q2ZG3HSdt2hiX34dkF7a75V2Oa_mMMQUp0DqSaEoY_PsjzdSDMQJBjn93D-V7kIQWAQ5qV_Wd3Q-3aOhr.jpg?size=1080x1080&quality=95&type=album"}
    return(
        <SafeAreaView style={{
            flex:1,
        }}>
            <LinearGradient style={{
                height:100,
                borderBottomLeftRadius:30,
                borderBottomRightRadius:30,
                justifyContent:'center'
            }}
                            colors={['#72c2d9','#35a9ad', '#03958b']}>
                <View style={{
                    flexDirection:'row',
                    justifyContent:'space-between',
                    alignItems:'center',
                    marginHorizontal:10
                }}>
                    <View style={{flexDirection:'row'}}>
                        <EvilIcons name="user" size={24} color="white" />
                            <Text style={{color:'white'}}>Здравствуйте, {user[0]?.name} {user[0]?.patronymic}</Text>
                    </View>
                    <Image source={{uri:user[0]?.img}} style={{
                        height:40,
                        width: 40,
                        borderRadius:40,
                        backgroundColor:'black',
                        borderColor:'white',
                        borderWidth: 2}}/>
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
                <Text>Расписание</Text>
            </Card>
            <View style={{flex:1}}>
                <View style={{
                    flex:1,
                    marginTop:30,

                }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {schedule.map((item)=>(
                            <TeacherScheduleComp data={item} navigation={navigation} name={user[0]?.fullName}/>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default TeacherSchedule