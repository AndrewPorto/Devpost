import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Feather from 'react-native-vector-icons/Feather'

import { Container, ButtonPost } from './styles'



function Home(){
  const navigation = useNavigation();

  return(
    <Container>
      <Text>TELA HOME</Text>

      <ButtonPost 
        activeOpacity={0.8}
        onPress={ () => navigation.navigate('NewPost')}
      >
        <Feather
          name='edit-2'
          color="#FFF"
          size={25}
        />
      </ButtonPost>
    </Container>
  )
}

export default Home;