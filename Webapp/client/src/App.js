import './components/styles/App.css';
import Header from './components/component/Header';
import Intial from './components/component/Intial';
import Homepage from './components/component/Homepage';
import { useEffect } from 'react';

function App() {

  const [data, setData] = React.useState(NULL);
  
  useEffect(() => {
    fetch("/get-entries")
      .then((res) => res.json())
      .then((data) => setData(data.message))
  }, []);  

  return (
    <div>
      <Header/>
      <Homepage/>
    </div>
  );
}

export default App;
