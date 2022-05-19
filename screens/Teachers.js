import {
    View,
    StyleSheet,
    TextInput,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Button,
    FlatList,
    Modal, Dimensions, ScrollView
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Card} from "react-native-shadow-cards";
import { AntDesign } from '@expo/vector-icons';
import {useEffect, useLayoutEffect, useState} from "react";
import {collection, getDocs, orderBy, query, where} from "firebase/firestore";
import {database} from "../config/firebase";
import firebase from "firebase/compat";
import {auth} from "../config/firebase";


const Teachers = () =>{
    const [filteredTeacher, setFilteredTeacher] = useState([])
    const [search, setSearch] = useState("")
    const options = ['Все кафедры','кафедра анализа данных и технологий программирования', 'кафедра информационных систем']
    const [modalVis, setModalVis] = useState(false)
    const [teacher, setTeacher] = useState([])
    const [department, setDepartment] = useState("Все кафедры")
    const WIDTH = Dimensions.get('window').width
    const HEIGHT = Dimensions.get('window').height
    useEffect(()=>{

        getTeachers()
    }, [])

    const getTeachers = async () =>{
        const teacherCol = collection(database, 'users')
        const q = query(teacherCol, where('teach', '==', true))
        const teacherSnap = await getDocs(q)
        if (department === "Все кафедры"){
            setTeacher(teacherSnap.docs.map((doc)=>({...doc.data(), id: doc.id})))
        }


    }


    const changeModal = (bool) =>{
        setModalVis(bool)
    }

    const handleSelect = async (select) =>{
        setModalVis(false)
        setDepartment(select)
    }

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

    return(
        <SafeAreaView style={styles.container}>
            <Modal
                transparent={true}
                animationType='fade'
                visible={modalVis}
                onRequestClose={()=> changeModal(false)}
            >
                <TouchableOpacity activeOpacity={10} onPress={()=>changeModal(false)}
                style={{
                    flex:1,
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <Card style={[styles.modal,{width: WIDTH - 40, height: HEIGHT/2}]}>
                        <ScrollView>
                            {options.map((item)=>(
                                <TouchableOpacity activeOpacity={10} style={{
                                    height:50,
                                    justifyContent:'center'
                                }}
                                onPress={()=>handleSelect(item)}>
                                    <Text style={{marginLeft:10}}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Card>
                </TouchableOpacity>
            </Modal>
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
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'center',

                    }}>

                            <TouchableOpacity activeOpacity={10} style={{
                                width:120,
                                height:30,
                                backgroundColor:'white',
                                borderRadius:10,
                                flexDirection:'row',
                                justifyContent:'space-between',
                                alignItems:'center'
                            }} onPress={()=>changeModal(true)}>
                                <Text style={{
                                    marginLeft:5
                                }}>Кафедра</Text>
                                <AntDesign style={{
                                    marginRight:5
                                }} name="down" size={18} color="black" />
                            </TouchableOpacity>
                        <Card style={{
                            height:30, width:150,borderRadius:10, flexDirection:'row'
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
                <Text>Преподаватели</Text>
            </Card>
            <View style={{
                flex:1,

            }}>
                <Card style={{
                    height:50,
                    borderRadius: 20,
                    marginTop:30,
                    width:'97%',
                    alignSelf:'center',
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <Text>{department}</Text>
                </Card>
                <View style={{
                    flex:1,
                    marginHorizontal:10,
                    marginVertical:10,
                }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{justifyContent:'space-between', flexDirection: "row", flexWrap: "wrap"}}
                    >
                        {
                                department === "Все кафедры"?
                                    search === ""?
                                        teacher.map((item, key)=>(
                                            <Card key={key} style={{
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
                                            </Card>)):
                                        filteredTeacher.map((item, key)=>(
                                            <Card key={key} style={{
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
                                    )):
                                        search === ""?
                                            teacher.filter((item)=> item.depart===department).map((item, key)=>(
                                                <Card key={key} style={{
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
                                                </Card>)):
                                            filteredTeacher.filter((item)=> item.depart===department).map((item, key)=>(
                                                <Card key={key} style={{
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
                            ))
                        }
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    modal:{
        backgroundColor:'white',
        borderRadius:10,
    }
})

export default Teachers