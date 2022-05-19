import {Modal, ScrollView, StyleSheet, Text, TouchableOpacity} from "react-native";
import {Card} from "react-native-shadow-cards";


const ModalView = ({modalVis, changeModal, handleSelect, HEIGHT, WIDTH}) =>{

    const options = [{name: 'Все', flow: 0},{name:'Январь', flow:1},{name:'Февраль', flow:2},{name:'Март', flow:3},{name:'Апрель', flow:4},{name:'Май', flow:5},{name:'Сентябрь', flow:9},{name:'Октябрь', flow:10},{name:'Ноябрь', flow:11},{name:'Декабрь', flow:12}]

    return(
        <Modal
            transparent={true}
            animationType='slide'
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
                                              onPress={()=>handleSelect(item.flow)}>
                                <Text style={{marginLeft:10}}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Card>
            </TouchableOpacity>
        </Modal>
    )
}

export default ModalView

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    modal:{
        backgroundColor:'white',
        borderRadius:10,
    }
})