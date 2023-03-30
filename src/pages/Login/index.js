import React, { useState } from 'react';
import { View, Text } from 'react-native';

import {Container, Title, Input, Button, ButtonText, SignUpButton, SignUpText} from './styles'

function Login(){
  const [login, setLogin] = useState(true)

  function toggleLogin(){
    setLogin(!login)
  }

  if(login){
    return(
      <Container>
        <Title>
          Dev<Text style={{color:'#E52246'}}>Post</Text>
        </Title>
  
        <Input 
          placeholder="Seu nome"
        />
        <Input 
          placeholder="Seuemail@teste.com"
        />
        <Input 
          placeholder="***************"
        />
  
        <Button>
          <ButtonText>Cadastrar</ButtonText>
        </Button>
  
        <SignUpButton onPress={toggleLogin}>
          <SignUpText>Já possuo uma conta</SignUpText>
        </SignUpButton>
  
      </Container>
    )
  }

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

      <SignUpButton onPress={toggleLogin}>
        <SignUpText>Criar uma conta</SignUpText>
      </SignUpButton>

    </Container>
  )
}

export default Login;