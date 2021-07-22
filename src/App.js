import './App.css';
import Layout from './hoc/Layout/Layout';
import Vehicles from './components/Vehicles/Vehicles';

import dotenv from 'dotenv';

dotenv.config();

function App() {
  return (
    <Layout>
      <Vehicles></Vehicles>
    </Layout>
  );
}

export default App;
