import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import type { Component, pageProps } from 'next/app'
import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
