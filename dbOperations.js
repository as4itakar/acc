import {collection, getDocs} from "firebase/firestore";
import {database} from "./config/firebase";

const getDB = async (tableName) =>{
    const table = collection(database, tableName)
    const data = await getDocs(table)
    return data.docs.map((doc) => ({...doc.data(), id: doc.id}))
}

export default getDB