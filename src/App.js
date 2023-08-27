import './App.css';
import Routes from './routes/Routes';
import { AuthContextProvider } from './contexts/AuthContext';
import { MessageContextProvider } from './contexts/MessageContext';

function App() {

  return (
    <AuthContextProvider>
      <MessageContextProvider>
        <Routes />
      </MessageContextProvider>
    </AuthContextProvider>
  );
}

export default App;
