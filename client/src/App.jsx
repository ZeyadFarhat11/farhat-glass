import axios from "axios";

function App() {
  const sendRequest = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/clients/64a2e1b257b1ef89586a1d6d",
        { withCredentials: true }
      );
      // const json = await response.json();
      console.log(response.data);
    } catch (e) {
      alert("error");
    }
  };
  return (
    <>
      <button onClick={sendRequest}>send request</button>
    </>
  );
}

export default App;
