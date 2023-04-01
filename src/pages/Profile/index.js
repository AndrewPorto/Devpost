import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Modal, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

import { AuthContext } from '../../contexts/auth'
import Header from '../../components/Header'
import {
  Container,
  Name,
  Email,
  Button,
  ButtonText,
  UploadButton,
  UploadText,
  Avatar,
  ModalContainer,
  ButtonBack,
  Input,
} from './styles'

import Feather from 'react-native-vector-icons/Feather'

function Profile(){
  const { signOut, user, setUser, storageUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user?.nome)
  const [url, setUrl] = useState(null);
  const [open, setOpen] = useState(false);

  async function handleSignOut(){
    await signOut();
  }

  useEffect(() =>{
    let isActive = true

    async function loadAvatar(){
      try{
        if(isActive){
          let response = await storage().ref('users').child(user?.uid).getDownloadURL()
        setUrl(response)
        }     
      }catch(err){
        console.log('nao encontramos nenhuma foto')
      }
    }

    loadAvatar();

    return () => isActive = false;
  },[])

  //atualizar o perfil
  async function updateProfile(){
   if(nome === ''){
    return;
   }

   await firestore().collection('users')
   .doc(user?.uid)
   .update({
    nome: nome
   })

   //Buscar todos os posts e atualizar o nome 
   const postDocs = await firestore().collection('posts')
   .where('userId', '==', user?.uid).get();

   // percorrer todos os posts desse user e atualizar

   postDocs.forEach( async doc => {
    await firestore().collection('posts').doc(doc.id)
    .update({
      autor: nome
    })
   })

   let data = {
    uid: user.uid,
    nome: nome,
    email: user.email
   }

   setUser(data);
   storageUser(data)
   setOpen(false)
   
  }

  const uploadFile = () => {
    const options = {
      noData: true,
      mediaType: 'photo'
    };

    launchImageLibrary(options, response =>{
      if(response.didCancel){
        console.log('Cancelou');
      }else if(response.error){
        console.log("algo deu errado")
      }else{
        //subir para o firebase
        uploadFileFirebase(response)
        .then(() => {
          uploadAvatarPosts()
        })

        setUrl(response.assets[0].uri)
      }
    })

  }

  const getFileLocalPath = (response) => {
    //extrair e retornar url da foto
    return response.assets[0].uri;
  }

  const uploadFileFirebase = async (response) =>{
      const fileSource = getFileLocalPath(response);

      const storageRef = storage().ref('users').child(user?.uid);

      return await storageRef.putFile(fileSource)
  }

  const uploadAvatarPosts = async () =>{
    const storageRef = storage().ref('users').child(user?.uid);
    const url = await storageRef.getDownloadURL()
    .then( async(image) => {
      //atualizar todas imagems do posts do user
      const postDocs = await firestore().collection('posts')
      .where('userId', '==', user.uid).get();

      //percorrer todos os posts e trocar a url da imagem;
      postDocs.forEach( async doc => {
        await firestore().collection('posts').doc(doc.id).update({
          avatarUrl: image
        })
      })
    })
    .catch((error) => {
      console.log('error ao atualizar a foto dos posts', error)
    })
  }

  return(
    <Container>
      <Header/> 

      { url ? (
        <UploadButton onPress={ () => uploadFile() }>
          <UploadText>+</UploadText>
          <Avatar
            source={{ uri: url }}
          />
        </UploadButton>
      ) : (
        <UploadButton onPress={ () => uploadFile() }>
          <UploadText>+</UploadText>
        </UploadButton>
      )}

      <Name>{user?.nome}</Name>
      <Email>{user?.email}</Email>

      <Button bg="#428cfd" onPress={ () => setOpen(true) } >
        <ButtonText color="#FFF">Atualizar Perfil</ButtonText>
      </Button>

      <Button bg="#ddd" onPress={ handleSignOut }>
        <ButtonText color="#353840">Sair</ButtonText>
      </Button>

      <Modal visible={open} animationType="slide" transparent={true}>
        <ModalContainer behavior={Platform.OS === 'android' ? '' : 'padding'}>
          <ButtonBack onPress={ () => setOpen(false) }>
            <Feather
              name="arrow-left"
              size={22}
              color="#121212"
            />
             <ButtonText color="#121212">Voltar</ButtonText>
          </ButtonBack>

          <Input 
            placeholder={user?.nome}
            value={nome}
            onChangeText={ (text) => setNome(text) }
          />

          <Button bg="#428cfd" onPress={ updateProfile }>
            <ButtonText color="#FFF">Salvar</ButtonText>
          </Button>
          

        </ModalContainer>
      </Modal>

    </Container>
  )
}

export default Profile;