import {Text, TouchableOpacity, View} from "react-native";
import {Card} from "react-native-shadow-cards";
import {useEffect, useLayoutEffect, useState} from "react";
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {auth, database} from "../config/firebase";

const TeacherScheduleComp = ({navigation,data, name}) =>{

    const [subject, setSubject] = useState([])
    const [user, setUser] = useState([])

    const getUser = async () =>{
        const usersCol = collection(database, 'users')
        const q = query(usersCol, where("email", "==", auth.currentUser.email))
        const userSnap = await getDocs(q)
        const trueUser = userSnap.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setUser(trueUser)

    }

    const getSubjects = async () =>{
        const subjectCol = collection(database, 'subjects')
        const q = query(subjectCol, orderBy('endHour', 'asc'))
        const subjectSnap = await getDocs(q)
        const subj = subjectSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
        const userSubj = subj.filter((item)=>item.teacher === user[0].fullName)
        const necessarySubj = userSubj.filter((subj)=>subj.day === data.dayname)
        setSubject(necessarySubj)

    }

    useLayoutEffect(()=>{
        getUser()
    }, [])

    useEffect(()=>{
        getSubjects()
    },[user])



    if (subject.length>0){
        return(
            <Card style={{width:'95%', height:100, alignSelf:'center', marginBottom:15}}>
                <TouchableOpacity activeOpacity={10} onPress={()=> navigation.navigate('DayScheduleScreen', {title: data.dayname})} style={{flex:1}}>
                    <View style={{height:50, borderBottomWidth:1, borderBottomColor:'black', justifyContent:'center', alignItems:'center'}}>
                        <Text>{data.dayname}</Text>
                    </View>
                    <View style={{height:50, justifyContent:'center', alignItems:'flex-end'}}>
                        <Text style={{marginRight:10}}>С {subject[0]?.startHour}:{subject[0]?.startMinute} до {subject[subject.length - 1]?.endHour}:{subject[subject.length - 1]?.endMinute}</Text>
                    </View>
                </TouchableOpacity>
            </Card>

        )
    }else {
        return null
    }

}

export default TeacherScheduleComp