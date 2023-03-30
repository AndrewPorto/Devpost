import React from 'react';
import { View, Text } from 'react-native';

import {Container, Title, Input, Button, ButtonText} from './styles'

function Home(){
  return(
    <Container>
      <Title>
        Dev<Text style={{color:'#E52246'}}>Post</Text>
      </Title>

      <Input 
        placeholder="Seuemail@teste.com"
      />
      <Input 
        placeholder="***************"
      />

      <Button>
        <ButtonText>Acessar</ButtonText>
      </Button>

    </Container>
  )
}

export default Home;