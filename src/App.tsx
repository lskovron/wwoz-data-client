import { ApolloClientProvider } from "./ApolloWrapper";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import EventsTable from "./pages/EventsTable";
import VenuesTable from "./pages/VenuesTable";
import Dates from "./pages/Dates";

function App() {
  return (
    <ApolloClientProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/barchart">
            <Barchart data={data} />
            <FetchButton setData={setData} />
          </Route> */}
          <Route path="/events-table" element={<EventsTable />} />
          <Route path="/venues-table" element={<VenuesTable />} />
          <Route path="/dates" element={<Dates />} />
        </Routes>
      </BrowserRouter>
    </ApolloClientProvider>
  );
}

export default App;
