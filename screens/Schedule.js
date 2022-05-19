import {StyleSheet, Text, View, SafeAreaView, Image, FlatList, TouchableOpacity} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {Card} from "react-native-shadow-cards";
import { EvilIcons } from '@expo/vector-icons';
import ScheduleComponent from "../components/ScheduleComponent";
import {useEffect, useLayoutEffect, useState} from "react";
import {collection, getDocs, query, orderBy, where} from "firebase/firestore";
import {database} from "../config/firebase";

import {auth} from "../config/firebase";



export default function Schedule({navigation}){
    const [user, setUser] = useState([])
    const [schedule, setSchedule] = useState([])




    useLayoutEffect(()=>{
        getUser()
        getSchedule()
    }, [])

    const getUser = async () => {
        const usersCol = collection(database, 'users')
        const q = query(usersCol, where("email", "==", auth.currentUser.email))
        const userSnap = await getDocs(q)
        setUser(userSnap.docs.map((doc) => ({...doc.data(), id: doc.id})))



    }

    const getSchedule = async () =>{
        const scheduleCol = collection(database, 'days')
        const q = query(scheduleCol, orderBy("flow", "asc"))
        const scheduleSnap = await getDocs(q)
        setSchedule(scheduleSnap.docs.map((doc)=>({...doc.data(), id: doc.id})))


    }



    const image = {uri: "https://sun9-74.userapi.com/s/v1/if2/H2zfkH2Q2ZG3HSdt2hiX34dkF7a75V2Oa_mMMQUp0DqSaEoY_PsjzdSDMQJBjn93D-V7kIQWAQ5qV_Wd3Q-3aOhr.jpg?size=1080x1080&quality=95&type=album"}

        return(
            <SafeAreaView style={styles.container}>
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
                            {user.map((item)=>(
                                <Text style={{color:'white'}}>Привет, {item.surname} {item?.name}</Text>
                            ))}
                        </View>
                        <TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
                            <Image source={{uri:user[0]?.img}} style={{
                                height:40,
                                width: 40,
                                borderRadius:40,
                                backgroundColor:'black',
                                borderColor:'white',
                                borderWidth: 2}}/>
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
                    <Text>Расписание</Text>
                </Card>
                <View style={{
                    flex:4,
                }}>
                    <View style={{flex:1,marginTop:20}}>
                        <FlatList keyExtractor={(item, index) => {return index.toString()}} data={schedule} showsVerticalScrollIndicator={false} renderItem={({item})=>
                            <ScheduleComponent data={item} navigation={navigation}/>
                        }/>
                    </View>


                </View>
            </SafeAreaView>
        )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})