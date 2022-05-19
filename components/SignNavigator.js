import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from "../screens/Login";

const Stack = createNativeStackNavigator()

const SignNavigator = () =>{
    return(
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Login" component={Login}/>
        </Stack.Navigator>
    )
}

export default SignNavigator