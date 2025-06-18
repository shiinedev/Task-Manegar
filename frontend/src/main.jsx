import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from './components/ui/sonner'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient} >
      <BrowserRouter>
      <Toaster position={"top-center"} />
         <App />
      </BrowserRouter>
       <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
   
  </StrictMode>,
)
