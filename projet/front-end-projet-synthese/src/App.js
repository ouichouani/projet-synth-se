
import Router from "./routes/router";
import UserProvider from "./provider/userProvider";


export default function App() {

  return (
    <UserProvider>
      <Router />
    </UserProvider>
  );
}
