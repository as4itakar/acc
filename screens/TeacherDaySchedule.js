import {View, SafeAreaView, Text, ScrollView, TouchableOpacity, Animated, Easing, StyleSheet} from "react-native";
import {AntDesign, Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {Card} from "react-native-shadow-cards";
import {useEffect, useState} from "react";
import {addDoc, collection, getDocs, orderBy, query, where, deleteDoc, doc} from "firebase/firestore";
import {auth, database} from "../config/firebase";



const TeacherDaySchedule = ({navigation, route}) =>{
    const [load, setLoad] = useState(false)
    const [requests, setRequests] = useState([])
    const [user, setUser] = useState([])
    const [subject, setSubject] = useState([])
    const [start, setStart] = useState(false)
    const [bottomFlex, setBottomFlex] = useState(new Animated.Value(1))

    const getUser = async () =>{
        const userCol = collection(database, 'users')
        const q = query(userCol, where('email', '==', auth.currentUser.email))
        const userSnap = await getDocs(q)
        setUser(userSnap.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }

    const getSubjects = async () =>{
        const subjCol = collection(database, 'subjects')
        const q = query(subjCol, orderBy('endHour', 'asc'))
        const subjSnap = await getDocs(q)
        setSubject(subjSnap.docs.map((doc) => ({...doc.data(), startTime: new Date(doc.data().start.seconds * 1000).getTime(), endTime: new Date(doc.data().end.seconds * 1000).getTime(), id: doc.id})))
    }



    useEffect(()=>{
        getUser()
        getSubjects()
    },[])

    const handleSubmit = async (name, startH, startM, endH, endM) =>{
        setStart(true)
        setLoad(false)
        const reqCol = collection(database, 'requests')
        const q = query(reqCol, orderBy('date', 'desc'))
        const reqSnap = await getDocs(q)
        const req = reqSnap.docs.map((doc)=>({...doc.data(), necDate: doc.data().date.seconds * 1000, time: new Date(doc.data().date.seconds * 1000).getTime(), day:new Date(doc.data().date.seconds * 1000).getDate(), month: new Date(doc.data().date.seconds * 1000).getMonth()+1, year:new Date(doc.data().date.seconds * 1000).getFullYear(), hours:new Date(doc.data().date.seconds * 1000).getHours(),minutes:new Date(doc.data().date.seconds * 1000).getMinutes(),id: doc.id}))
        const necReq = req.filter((item) =>  item.name === name)
        const updReq = necReq.filter((item) => parseInt(item.hours.toString()+item.minutes.toString()) >= parseInt(startH.toString()+startM.toString()) && parseInt(item.hours.toString()+item.minutes.toString()) <= parseInt(endH.toString()+endM.toString()))
        setRequests(updReq)
        setLoad(true)
    }

    const trueRequestProcessing = async (subName, dateT, email, id) =>{
        const attDoc = collection(database, 'attendance')
        const reqDoc = doc(database, 'requests', id)
        await addDoc(attDoc, {name: subName, date:dateT, user:email})
        await deleteDoc(reqDoc)
        const upgradeRequests = requests.filter((item)=>item.id !== id)
        setRequests(upgradeRequests)

    }

    const falseRequestProcessing = async (subName, dateT, email, id) =>{
        const reqDoc = doc(database, 'requests', id)
        await deleteDoc(reqDoc)
        const upgradeRequests = requests.filter((item)=>item.id !== id)
        setRequests(upgradeRequests)
    }

    const handleClose = () =>{
        setStart(false)
        setLoad(false)
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
        <SafeAreaView style={{flex:1}}>
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
            <View style={{flex:1}}>
                <ScrollView showsVerticalScrollIndicator={false} style={{flex:1, marginTop:20, marginVertical:10}}>
                    {subject.filter((item)=>item.teacher === user[0].fullName && item.day === route.params?.title).map((item, index)=>(
                        <TouchableOpacity activeOpacity={10} onPress={()=>handleSubmit(item.name, item.startHour, item.startMinute, item.endHour, item.endMinute)} style={{width:'95%', height:100, alignSelf:'center', marginVertical:10}}>
                            <Card style={{width:'100%', height:'100%'}}>
                                <View style={{flex:1, marginHorizontal:10,flexDirection:'row', justifyContent:'space-between'}}>
                                    <View style={{flex:1, justifyContent:'center', alignItems:'flex-start'}}>
                                        <Text>{item.name}</Text>
                                    </View>
                                    <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
                                        <Text>{item.startHour}:{item.startMinute} - {item.endHour}:{item.endMinute}</Text>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))}

                </ScrollView>
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
                        {
                            requests.length !== 0?

                                <ScrollView showsVerticalScrollIndicator={false} style={{flex:1, marginVertical:15, marginHorizontal:10,}}>
                                    {
                                        requests.map((item)=>{
                                            if (load){
                                                return(
                                                    <Card style={{width: '95%', height: 60, alignSelf:'center', marginVertical:5}}>
                                                        <View style={{flex:1, marginHorizontal:10, flexDirection:'row', justifyContent:'space-between'}}>
                                                            <View style={{flex:1, alignItems: 'flex-start', justifyContent:'center'}}>
                                                                <Text>{item.userName}</Text>
                                                            </View>
                                                            <View style={{flex:.6, alignItems: 'flex-start', justifyContent:'center'}}>
                                                                <Text>{item.day}/{item.month}/{item.year}</Text>
                                                                <Text style={{alignSelf:'center'}}>{item.hours}:{item.minutes}</Text>
                                                            </View>
                                                            <View style={{flex:.5, alignItems: 'center', flexDirection:'row'}}>
                                                                <TouchableOpacity onPress={()=>trueRequestProcessing( item.name, item.date, item.userEmail, item.id)} style={{marginRight:10, height: 35, width:35, borderRadius:40, backgroundColor:'#f48d3c', alignItems: 'center', justifyContent:'center'}}>
                                                                    <Feather name="check" size={20} color="white" />
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={()=>falseRequestProcessing(item.name, item.date, item.userEmail, item.id)} style={{height: 35, width:35, borderRadius:40, backgroundColor:'#f48d3c', alignItems: 'center', justifyContent:'center'}}>
                                                                    <AntDesign name="close" size={20} color="white" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </Card>
                                                )
                                            }else {
                                                return null
                                            }
                                        })
                                    }
                                </ScrollView>:
                                <View style={{
                                    flex:1,
                                    marginVertical:15,
                                    marginHorizontal:10,
                                    justifyContent:'center',
                                    alignItems: 'center'
                                }}>
                                    <Text>Список пуст.</Text>
                                </View>
                        }
                        <View style={{
                            height: 50,
                            alignItems:'center',
                            justifyContent:'center',
                        }}>
                            <TouchableOpacity onPress={handleClose} style={{
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

export default TeacherDaySchedule