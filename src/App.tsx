import { Container } from "@mui/material";
import { ApolloClientProvider } from "./ApolloWrapper";
import Barchart from "./Barchart";
import { FetchButton } from "./FetchButton";
import { useState } from "react";

function App() {
  const [data, setData] = useState([]);
  return (
    <ApolloClientProvider>
      <Container maxWidth="sm">
        <Barchart data={data} />
        <FetchButton setData={setData} />
      </Container>
    </ApolloClientProvider>
  );
}

export default App;
