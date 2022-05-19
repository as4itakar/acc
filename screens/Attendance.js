import {View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity, ScrollView, Modal} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {AntDesign} from "@expo/vector-icons";
import {Card} from "react-native-shadow-cards";

import {
    LineChart,
} from "react-native-chart-kit";
import {useEffect, useState} from "react";
import ModalView from "../components/ModalView";



const Attendance = ({navigation, route}) =>{
    const [attendance, setAttendance] = useState([])
    const [necMonth, setNecMonth] = useState(0)
    const [modalVis, setModalVis] = useState(false)
    const WIDTH = Dimensions.get('window').width
    const HEIGHT = Dimensions.get('window').height

    useEffect(()=>{
        handleFilter()
    },[necMonth])

    const handleFilter = () =>{
        if (necMonth !== 0){
            const att = route.params?.attendance.filter((item)=>item.month === necMonth)
            setAttendance(att)
        }else {
            setAttendance(route.params?.attendance)
        }
    }


    const changeModal = (bool) =>{
        setModalVis(bool)
    }

    const handleSelect = async (select) =>{
        setModalVis(false)
        setNecMonth(select)
    }

    return(
        <SafeAreaView style={styles.container}>
            <ModalView modalVis={modalVis} changeModal={changeModal} HEIGHT={HEIGHT} WIDTH={WIDTH} handleSelect={handleSelect}/>
            <LinearGradient style={{
                height:80,
                borderBottomLeftRadius:30,
                borderBottomRightRadius:30,
            }}
                            colors={['#72c2d9','#35a9ad', '#03958b']}>
                <View style={{
                    flex:1,
                    marginHorizontal:20,
                    justifyContent:'space-between',
                    flexDirection:'row',
                    alignItems:'center'
                }}>
                    {
                        route.params?.userName?
                            <TouchableOpacity activeOpacity={10} onPress={()=> navigation.navigate('UserListScreen')}>
                                <AntDesign name="leftcircleo" size={20} color="white" />
                            </TouchableOpacity>:
                            <TouchableOpacity activeOpacity={10} onPress={()=> navigation.navigate('ProfileScreen')}>
                                <AntDesign name="leftcircleo" size={20} color="white" />
                            </TouchableOpacity>
                    }
                    <TouchableOpacity activeOpacity={10} onPress={()=>setModalVis(true)} style={{
                        height:30,
                        width:100,
                        backgroundColor:'white',
                        borderRadius: 10
                    }}>
                       <View style={{
                           flex:1,
                           marginHorizontal:5,
                           flexDirection:'row',
                           justifyContent:'space-between',
                           alignItems:'center',
                       }}>
                           <Text>Месяц</Text>
                           <AntDesign name="down" size={15} color="black" />
                       </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
            {
                route.params?.userName ?
                    <Card style={{
                        height:30,
                        marginVertical:-15,
                        alignSelf:'center',
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                        <Text>{route.params?.userName}</Text>
                    </Card>:
                    <Card style={{
                        width:160,
                        height:30,
                        marginVertical:-15,
                        alignSelf:'center',
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                        <Text>Посещамость</Text>
                    </Card>
            }
            <View style={{
                flex:1,
                alignItems:'center'
            }}>
                <View style={{
                    height:220,
                    width:380,
                    marginVertical:25,
                    alignItems:'center'
                }}>
                    <LineChart
                        data={{
                            labels: ["Янв", "Фев", "Март", "Апр", "Май", "Сент", "Окт", "Нояб", "Дек"],
                            datasets: [
                                {
                                    data:[
                                        route.params?.attCount[0],
                                        route.params?.attCount[1],
                                        route.params?.attCount[2],
                                        route.params?.attCount[3],
                                        route.params?.attCount[4],
                                        route.params?.attCount[5],
                                        route.params?.attCount[6],
                                        route.params?.attCount[7],
                                        route.params?.attCount[8]
                                    ]
                                }
                            ]
                        }}
                        width={380} // from react-native
                        height={220}

                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726"
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                </View>
                {
                    route.params?.attendance.length !== 0?
                        <ScrollView contentContainerStyle={{
                            alignItems:'center'
                        }} style={{
                            width:'100%',
                            marginBottom:20,

                        }}>
                            {
                                attendance.map((item)=>(
                                    <Card style={{
                                        height:100,
                                        marginBottom:15,
                                    }}>
                                        <View style={{
                                            flex:1,
                                            marginHorizontal:10,
                                            alignItems:'center',
                                            flexDirection:'row',
                                            justifyContent:"space-between"
                                        }}>
                                            <View style={{
                                                flex:1,
                                                alignItems:'flex-start'
                                            }}>
                                                <Text>{item.name}</Text>
                                            </View>
                                            <View style={{
                                                flex:.5,
                                                alignItems:'center'
                                            }}>
                                                <Text>{item.day}/{item.month}/{item.year}</Text>
                                            </View>
                                            <View style={{
                                                flex:.5,
                                                alignItems:'flex-end'
                                            }}>
                                                <Text>{item.hours}:{item.minutes}</Text>
                                            </View>

                                        </View>
                                    </Card>
                                ))
                            }
                        </ScrollView>:
                        <Text>Студент пока не посетил ни одной пары</Text>
                }
            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    modal:{
        backgroundColor:'white',
        borderRadius:10,
    }
})

export default Attendance