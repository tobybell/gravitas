import * as React from 'react';
import './App.css';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div className="App-tl" />
        <div className="App-tr" />
        <div className="App-bl" />
        <div className="App-br" />
      </div>
    );
  }
}

export default App;
