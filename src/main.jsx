import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import App from './App.jsx'
import './App.scss'
import './i18n'
import { ProgressSpinner } from 'primereact/progressspinner'

const LoadingFallback = () => (
  <ProgressSpinner className="custom-page-proggress" />
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
