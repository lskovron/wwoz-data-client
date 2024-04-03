import { Container } from "@mui/material";
import { ApolloClientProvider } from "./ApolloWrapper";
import Barchart from "./Barchart";
import { FetchButton } from "./FetchButton";

function App() {
  return (
    <ApolloClientProvider>
      <Container maxWidth="sm">
        <Barchart />
        <FetchButton />
      </Container>
    </ApolloClientProvider>
  );
}

export default App;
