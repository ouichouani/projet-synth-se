
import Router from "./routes/router";
import './css/parties.css';
import './css/user.css';
import UserProvider from "./provider/userProvider";


export default function App() {

  return (
    <UserProvider>
      <Router />
    </UserProvider>
  );
}
