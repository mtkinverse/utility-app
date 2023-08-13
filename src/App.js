import AddValues from './components/AddValues';
import Home from './components/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <div className='clear-both'></div>
      <section id='home'>
        <Home />
      </section>
      <div className='container'>
        <h1 style={{marginLeft:'1%',fontSize:'1.75rem'}}>Track your records here :</h1>
      </div>
      <section id='add-values'>
        <AddValues />
      </section>
    </>
  );
}

export default App;
