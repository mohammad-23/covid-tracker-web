import "./App.css";

import TrackerGraph from "./TrackerGraph";

const App = () => {
  return (
    <div className="container">
      <div className="app-header">Covid Tracker Scatter Chart</div>
      <TrackerGraph />
    </div>
  );
};

export default App;
