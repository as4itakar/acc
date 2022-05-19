import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Feather, FontAwesome5, Ionicons} from "@expo/vector-icons";
import TeacherSchedule from "../screens/TeacherSchedule";
import UserList from "../screens/UserList";
import TeacherProfile from "../screens/TeacherProfile";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import TeacherDaySchedule from "../screens/TeacherDaySchedule";
import Attendance from "../screens/Attendance";

const Tab = createBottomTabNavigator()

const Stack = createNativeStackNavigator()

const ScheduleForTeacher = () =>{
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="ScheduleScreen" component={TeacherSchedule}/>
            <Stack.Screen name="DayScheduleScreen" component={TeacherDaySchedule}/>
        </Stack.Navigator>
)
}

const UserListStack = () =>{
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="UserListScreen" component={UserList}/>
            <Stack.Screen name="UserProfileScreen" component={Attendance}/>
        </Stack.Navigator>
    )
}

const TeacherNavigation = () => {

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {

                backgroundColor: 'black',
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
            },
            tabBarInactiveTintColor: '#fff',
            tabBarActiveTintColor: '#72c2d9'
        }}>
            <Tab.Screen name="TeacherSchedule" component={ScheduleForTeacher} options={{
                tabBarIcon: ({size, color}) => (
                    <Ionicons name="time-outline" size={25} color={color}/>
                )
            }}/>
            <Tab.Screen name="Students" component={UserListStack} options={{
                tabBarIcon: ({size,color})=>(
                    <Feather name="users" size={25} color={color}/>
                )
            }}/>
            <Tab.Screen name="TeacherProfile" component={TeacherProfile} options={{
                tabBarIcon: ({size,color})=>(
                    <FontAwesome5 name="user" size={21} color={color}/>
                )
            }}/>
        </Tab.Navigator>
    )
}

export default TeacherNavigation