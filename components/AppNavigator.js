import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Profile from "../screens/Profile.js"
import Schedule from "../screens/Schedule.js"
import Teachers from "../screens/Teachers.js"
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import DaySchedule from "../screens/DaySchedule";
import Attendance from "../screens/Attendance";
import Teacher from "../screens/Teacher";



const Tab = createBottomTabNavigator()

const Stack = createNativeStackNavigator()

const ScheduleScreen = () =>{
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="ScheduleScreen" component={Schedule}/>
            <Stack.Screen name="DayScheduleScreen" component={DaySchedule}/>
        </Stack.Navigator>
    )
}

const ProfileScreen = () =>{
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="ProfileScreen" component={Profile}/>
            <Stack.Screen name="AttendanceScreen" component={Attendance}/>
        </Stack.Navigator>
    )
}

const TeachersScreen = () =>{
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="TeachersScreen" component={Teachers}/>
            <Stack.Screen name="TeacherScreen" component={Teacher}/>
        </Stack.Navigator>
    )
}

const AppNavigator = () =>{

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle:{
                backgroundColor:'black',
                borderTopRightRadius: 20,
                borderTopLeftRadius:20,
            },
            tabBarInactiveTintColor: '#fff',
            tabBarActiveTintColor: '#72c2d9'
        }}>
            <Tab.Screen name="Schedule" component={ScheduleScreen} options={{
                tabBarIcon: ({size,color})=>(
                    <Ionicons name="time-outline" size={25} color={color}/>
                )
            }}/>
            <Tab.Screen name="Teachers" component={TeachersScreen} options={{
                tabBarIcon: ({size,color})=>(
                    <Feather name="users" size={25} color={color}/>
                )
            }}/>
            <Tab.Screen name="Profile" component={ProfileScreen} options={{
                tabBarIcon: ({size,color})=>(
                    <FontAwesome5 name="user" size={21} color={color}/>
                )
            }}/>
        </Tab.Navigator>
    )
}



export default AppNavigator;