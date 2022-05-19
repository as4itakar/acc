import {View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Animated, Easing, Alert} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useEffect, useLayoutEffect, useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth"
import {collection, getDocs} from "firebase/firestore"
import {auth, database} from "../config/firebase";

import { Feather } from '@expo/vector-icons';


const Login = () =>{

    const [start, setStart] = useState(false)
    const [bottomFlex, setBottomFlex] = useState(new Animated.Value(1))
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [visPas, setVisPas] = useState(true)
    const [users, setUsers] = useState([])
    const [user, setUser] = useState([])

    const handleLogin = async () =>{
        const usersCol = collection(database, 'users')
        const userData = await getDocs(usersCol)
        setUsers(userData.docs.map((doc)=>({...doc.data(), id: doc.id})))
        setUser(users.find((item)=>item.email === email))
        if(user && password !== ""){
            signInWithEmailAndPassword(auth, email, password)
                .then(() => console.log("Login success"))
                .catch((err) => Alert.alert("Login error", err.message));
        }
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
        <LinearGradient
            style={{flex:1, justifyContent:'center'}}
            colors={['#72c2d9','#35a9ad', '#03958b']}>
            <View style={{flex:2, justifyContent:'flex-end', alignItems:'center', marginBottom:50}}>
                <Text style={{color:'white', fontSize:35,fontWeight:'bold', letterSpacing:10}}>NMS</Text>
            </View>
            <Animated.View style={[styles.container, {flex:bottomFlex}]}>
                {start
                    ?
                    <View style={{flex:1, backgroundColor:'white', borderTopLeftRadius:180}}>

                        <View style={{flex:1, alignItems:'center', marginTop:60}}>
                            <Text style={{fontSize:20, fontWeight:'bold'}}>Авторизация</Text>
                            <TextInput style={{borderRadius:15, backgroundColor:'#72c2d980',
                                height:40, width:'80%', padding:10,
                                textAlign:'center', marginVertical:15,
                                fontSize:15, fontWeight:'bold'}}
                                       autoCapitalize="none"
                                       keyboardType="email-address"
                                       textContentType="emailAddress"
                                       autoFocus={true}
                                       value={email}
                                       onChangeText={(text) => setEmail(text)}
                                       placeholder="Введите почту..."/>
                            <View style={{height:40, width:'80%',marginVertical:15, flexDirection:'row'}}>
                                <TextInput style={{borderRadius:15, backgroundColor:'#72c2d980',
                                    height:'100%', width:'100%', padding:10,
                                    textAlign:'center',
                                    fontSize:15, fontWeight:'bold'}} textContentType="password"
                                           autoCapitalize="none"
                                           autoCorrect={false}
                                           secureTextEntry={visPas}
                                           value={password}
                                           onChangeText={(text) => setPassword(text)}
                                           placeholder="Введите пароль..."/>
                                {visPas?
                                    <Feather name="eye" onPress={()=>setVisPas(!visPas)} size={24} color="gray" style={{position:'absolute', alignSelf:'center', right:10 }}/>:
                                    <Feather name="eye-off" onPress={()=>setVisPas(!visPas)} size={24} color="gray" style={{position:'absolute', alignSelf:'center', right:10 }}/>}
                            </View>

                            <TouchableOpacity onPress={handleLogin} style={{
                                backgroundColor:'#f48d3c', height:40, width:200,
                                justifyContent:'center', alignItems:'center',
                                borderRadius:20, shadowColor:'#0f0f0f',
                                shadowOffset:{width:0, height:4},
                                shadowOpacity:0.3,
                                shadowRadius:5,
                                elevation:5}}>
                                <Text style={{color:'white', fontWeight:'bold',fontSize:15}}>Войти</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View style={{flex:1, alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>setStart(!start)} style={{
                            backgroundColor:'#f48d3c', height:40, width:200,
                            justifyContent:'center', alignItems:'center',
                            borderRadius:20, shadowColor:'#0f0f0f',
                            shadowOffset:{width:0, height:4},
                            shadowOpacity:0.3,
                            shadowRadius:5,
                            elevation:5}}>
                            <Text style={{color:'white', fontWeight:'bold',fontSize:15}}>Начните уже сейчас</Text>
                        </TouchableOpacity>
                    </View>
                }
            </Animated.View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,


    }
})

export default Login