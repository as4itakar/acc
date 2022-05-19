import {SafeAreaView, View, Text, TouchableOpacity, TextInput, ScrollView, Image, Dimensions} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {Card} from "react-native-shadow-cards";
import {LinearGradient} from "expo-linear-gradient";
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {database} from "../config/firebase";
import {useEffect, useState} from "react";

const UserList = ({navigation}) =>{
    const [load, setLoad] = useState(false)
    const [filteredTeacher, setFilteredTeacher] = useState([])
    const [search, setSearch] = useState("")
    const [teacher, setTeacher] = useState([])
    const [department, setDepartment] = useState("Все кафедры")
    const options = [{name:'Январь', flow:1},{name:'Февраль', flow:2},{name:'Март', flow:3},{name:'Апрель', flow:4},{name:'Май', flow:5},{name:'Сентябрь', flow:9},{name:'Октябрь', flow:10},{name:'Ноябрь', flow:11},{name:'Декабрь', flow:12}]


    const getStudents = async () =>{
        const teacherCol = collection(database, 'users')
        const q = query(teacherCol, where('teach', '==', false))
        const teacherSnap = await getDocs(q)
        setTeacher(teacherSnap.docs.map((doc)=>({...doc.data(), id: doc.id})))
        setLoad(true)
    }

    useEffect(()=>{
        getStudents()
    }, [])

    const handleSearch = (text) =>{
        setSearch(text)
        if (text){
            const newData = teacher.filter(item => {
                const itemData = item.fullName ? item.fullName.toUpperCase() : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredTeacher(newData)
        }else {
            setFilteredTeacher(teacher)
        }
    }

    const handleSelectUser = async (userName,userEmail)=>{
        const attCol = collection(database, 'attendance')
        const q = query(attCol, orderBy('date', 'desc'))
        const attRef = await getDocs(q)
        const att = attRef.docs.map((doc)=>({...doc.data(), necDate: doc.data().date.seconds * 1000, day:new Date(doc.data().date.seconds * 1000).getDate(), month: new Date(doc.data().date.seconds * 1000).getMonth()+1, year:new Date(doc.data().date.seconds * 1000).getFullYear(), hours:new Date(doc.data().date.seconds * 1000).getHours(),minutes:new Date(doc.data().date.seconds * 1000).getMinutes(),id: doc.id}))
        const attendance = att.filter((item) => item.user === userEmail)
        const attCount = []
        options.map((opt) =>{
            let count = 0
            attendance.map((att) => {
                if (opt.flow === att.month){
                    count = count + 1
                }
            })
            attCount.push(count)
        })
        navigation.navigate(('UserProfileScreen'), {attendance, attCount, userName})
    }


    return(
        <SafeAreaView style={{flex:1}}>
            <LinearGradient style={{
                height:100,
                borderBottomLeftRadius:30,
                borderBottomRightRadius:30,
            }} colors={['#72c2d9','#35a9ad', '#03958b']}>
                <View style={{
                    flex:1,
                    marginHorizontal:20
                }}>
                    <View style={{
                        flex:1,
                        justifyContent:'center',
                        alignItems:'center',

                    }}>
                        <Card style={{
                            height:30, width:'80%',borderRadius:10, flexDirection:'row'
                        }}>
                            <TextInput style={{borderRadius:10, backgroundColor:'white',
                                height:'100%', width:'100%',
                                paddingLeft:5,
                                fontSize:13, fontWeight:'bold', color:'black'}}
                                       placeholder="Поиск..." placeholderTextColor = "black" onChangeText={(text) => handleSearch(text)}/>
                            <AntDesign style={{
                                position:'absolute',
                                alignSelf:'center',
                                right:10
                            }} name="search1" size={18} color="black" />
                        </Card>
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
                <Text>Студенты</Text>
            </Card>
            <View style={{
                flex:1,

            }}>
                <View style={{
                    flex:1,
                    marginHorizontal:10,
                    marginVertical:30,
                }}>
                    {
                        load?
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{justifyContent:'space-between', flexDirection: "row", flexWrap: "wrap"}}
                            >
                                {
                                    department === "Все кафедры"?
                                        search === ""?
                                            teacher.map((item)=>(
                                                <TouchableOpacity onPress={()=>handleSelectUser(item.fullName, item.email)}>
                                                    <Card key={item} style={{
                                                        width:190,
                                                        height:120,
                                                        marginBottom:15,
                                                        zIndex:21
                                                    }}>
                                                        <View style={{
                                                            height:'70%',
                                                            width:'100%',
                                                            borderRadius:4,
                                                        }}>
                                                            {item.img?
                                                                <Image source={{uri:item.img}} style={{
                                                                    height:'100%',
                                                                    width:'100%',
                                                                    borderRadius:4,


                                                                }}/>:
                                                                <Image source={{uri:"https://keemaesthetics.co.uk/sites/default/files/styles/mt_testimonial_image/public/2016-11/testimonial-6.jpg?itok=ZntA2jRH"}} style={{
                                                                    height:'100%',
                                                                    width:'100%',
                                                                    borderRadius:4,


                                                                }}/>
                                                            }
                                                        </View>
                                                        <View style={{
                                                            flex:1,
                                                            justifyContent:'center',
                                                            alignItems:'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize:12,
                                                                marginLeft:5
                                                            }}>{item.surname} {item.name} {item.patronymic}</Text>
                                                        </View>
                                                    </Card>
                                                </TouchableOpacity>
                                            )):
                                            filteredTeacher.map((item)=>(
                                                <TouchableOpacity onPress={()=>handleSelectUser(item.fullName, item.email)}>
                                                    <Card key={item} style={{
                                                        width:190,
                                                        height:120,
                                                        marginBottom:15,
                                                        zIndex:21
                                                    }}>
                                                        <View style={{
                                                            height:'70%',
                                                            width:'100%',
                                                            borderRadius:4,
                                                        }}>
                                                            {item.img?
                                                                <Image source={{uri:item.img}} style={{
                                                                    height:'100%',
                                                                    width:'100%',
                                                                    borderRadius:4,


                                                                }}/>:
                                                                <Image source={{uri:"https://keemaesthetics.co.uk/sites/default/files/styles/mt_testimonial_image/public/2016-11/testimonial-6.jpg?itok=ZntA2jRH"}} style={{
                                                                    height:'100%',
                                                                    width:'100%',
                                                                    borderRadius:4,


                                                                }}/>
                                                            }
                                                        </View>
                                                        <View style={{
                                                            flex:1,
                                                            justifyContent:'center',
                                                            alignItems:'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize:12,
                                                                marginLeft:5
                                                            }}>{item.surname} {item.name} {item.patronymic}</Text>
                                                        </View>
                                                    </Card>
                                                </TouchableOpacity>
                                            )):
                                        search === ""?
                                            teacher.filter((item)=> item.depart===department).map((item)=>(
                                                <TouchableOpacity onPress={()=>handleSelectUser(item.fullName, item.email)}>
                                                    <Card key={item} style={{
                                                        width:190,
                                                        height:120,
                                                        marginBottom:15,
                                                        zIndex:21
                                                    }}>
                                                        <View style={{
                                                            height:'70%',
                                                            width:'100%',
                                                            borderRadius:4,
                                                        }}>
                                                            {item.img?
                                                                <Image source={{uri:item.img}} style={{
                                                                    height:'100%',
                                                                    width:'100%',
                                                                    borderRadius:4,


                                                                }}/>:
                                                                <Image source={{uri:"https://keemaesthetics.co.uk/sites/default/files/styles/mt_testimonial_image/public/2016-11/testimonial-6.jpg?itok=ZntA2jRH"}} style={{
                                                                    height:'100%',
                                                                    width:'100%',
                                                                    borderRadius:4,


                                                                }}/>
                                                            }
                                                        </View>
                                                        <View style={{
                                                            flex:1,
                                                            justifyContent:'center',
                                                            alignItems:'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize:12,
                                                                marginLeft:5
                                                            }}>{item.surname} {item.name} {item.patronymic}</Text>
                                                        </View>
                                                    </Card>
                                                </TouchableOpacity>
                                            )):
                                            filteredTeacher.filter((item)=> item.depart===department).map((item)=>(
                                                <TouchableOpacity onPress={()=>handleSelectUser(item.fullName, item.email)}>
                                                    <Card key={item} style={{
                                                        width:190,
                                                        height:120,
                                                        marginBottom:15,
                                                        zIndex:21
                                                    }}>
                                                        <View style={{
                                                            height:'70%',
                                                            width:'100%',
                                                            borderRadius:4,
                                                        }}>
                                                            {item.img?
                                                                <Image source={{uri:item.img}} style={{
                                                                    height:'100%',
                                                                    width:'100%',
                                                                    borderRadius:4,


                                                                }}/>:
                                                                <Image source={{uri:"https://keemaesthetics.co.uk/sites/default/files/styles/mt_testimonial_image/public/2016-11/testimonial-6.jpg?itok=ZntA2jRH"}} style={{
                                                                    height:'100%',
                                                                    width:'100%',
                                                                    borderRadius:4,


                                                                }}/>
                                                            }
                                                        </View>
                                                        <View style={{
                                                            flex:1,
                                                            justifyContent:'center',
                                                            alignItems:'center'
                                                        }}>
                                                            <Text style={{
                                                                fontSize:12,
                                                                marginLeft:5
                                                            }}>{item.surname} {item.name} {item.patronymic}</Text>
                                                        </View>
                                                    </Card>
                                                </TouchableOpacity>
                                            ))
                                }
                            </ScrollView>:
                            null
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}

export default UserList