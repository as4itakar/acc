import React, {useState, createContext, useContext, useEffect, useLayoutEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {Image} from "react-native";
import { onAuthStateChanged } from 'firebase/auth';
import {auth, database} from "./config/firebase";
import AppNavigator from "./components/AppNavigator";
import SignNavigator from "./components/SignNavigator";


import {LogBox, Text, View} from 'react-native';
import {collection, getDocs, query, where} from "firebase/firestore";
import TeacherNavigation from "./components/TeacherNavigation";
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreAllLogs()

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    return (
        <AuthenticatedUserContext.Provider value={{ user, setUser, userInfo, setUserInfo }}>
            {children}
        </AuthenticatedUserContext.Provider>
    );
};

function RootNavigator (){
    const {userInfo, setUserInfo} = useContext(AuthenticatedUserContext)
    const [loading, setLoading] = useState(false)
    const { user, setUser } = useContext(AuthenticatedUserContext);

    useEffect(() => {
        onAuthStateChanged(auth,  async authenticatedUser=>{
            if (authenticatedUser){
                setLoading(true)
                const usersCol = collection(database, 'users')
                const q = query(usersCol, where("email", "==", authenticatedUser.email))
                const userSnap = await getDocs(q)
                setUserInfo(userSnap.docs.map((doc) => ({...doc.data(), id: doc.id})))
                setUser(authenticatedUser)
                setLoading(false)
            }else{
                setUser(null)
                setUserInfo(null)
            }
        })
        console.log(user)
        console.log(userInfo)
    }, [user]);



    if (loading){
        return (
            <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
                <Image source={require('./assets/loader/loader.gif')} style={{width:250, height:250}}/>
            </View>
        )
    }

    return(
        <NavigationContainer>
            {user ? userInfo[0]?.teach? <TeacherNavigation/>: <AppNavigator/>: <SignNavigator/>}
        </NavigationContainer>

    )



}


const App = () => {
  return (
      <AuthenticatedUserProvider>
          <RootNavigator/>
      </AuthenticatedUserProvider>
  )
}

export default App


