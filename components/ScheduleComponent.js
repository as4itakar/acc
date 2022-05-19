import {View, Text, TouchableOpacity, ScrollView, FlatList} from 'react-native'
import {Card} from "react-native-shadow-cards";
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {auth, database} from "../config/firebase";
import {useEffect, useLayoutEffect, useState} from "react";
import {data} from "../scheduleData";




const ScheduleComponent = ({navigation,data}) =>{

    const [subject, setSubject] = useState([])




    useLayoutEffect(()=>{
        const getSubjects = async () =>{
            const subjectCol = collection(database, 'subjects')
            const q = query(subjectCol, orderBy('endHour', 'asc'))
            const subjectSnap = await getDocs(q)
            const subj = subjectSnap.docs.map((doc)=>({...doc.data(), id: doc.id}))
            const necessarySubjects = subj.filter((item) => item.day === data.dayname)
            setSubject(necessarySubjects)


        }
        getSubjects()
    }, [])

    return(
            <Card style={{width:'95%', height:100, alignSelf:'center', marginVertical:10}}>
                <TouchableOpacity activeOpacity={10} onPress={()=> navigation.navigate('DayScheduleScreen', {title: data.dayname, dayWeek: data.flow})} style={{flex:1}}>
                    <View style={{height:50, borderBottomWidth:1, borderBottomColor:'black', justifyContent:'center', alignItems:'center'}}>
                        <Text>{data.dayname}</Text>
                    </View>
                    <View style={{height:50, justifyContent:'center', alignItems:'flex-end'}}>
                        <Text style={{marginRight:10}}>С {subject[0]?.startHour}:{subject[0]?.startMinute} до {subject[subject.length - 1]?.endHour}:{subject[subject.length - 1]?.endMinute}</Text>
                    </View>
                </TouchableOpacity>
            </Card>

    )
}

export default ScheduleComponent