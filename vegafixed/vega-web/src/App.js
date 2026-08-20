import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePageLayout from './components/templates/HomePageLayout.js';
import { Route, Switch } from 'react-router-dom';
import PlatformInfo from './components/pages/PlatformInfo';
import Login from './components/pages/Login.js';
import NewsAndEvents from './components/pages/NewsAndEvents.js';
import Resources from './components/pages/Resources.js';
import AdminPanel from './components/pages/admin/AdminPanel';
import Leadership from './components/pages/Leadership.js';
import {UserProvider} from './auth/UserProvider.js';
import contactus from './components/pages/ContactUs.js';
import signUp from './components/pages/SignUp.js';
import defenseAppDashboard from './components/pages/DefenseAppDashboard.js';


function App() {

  return (
   <UserProvider> 
        <Switch>
        	<Route path="/" component={HomePageLayout} exact />
        	<Route path="/contactus" component={contactus} exact />
        	<Route path="/leadership" component={Leadership} exact />
        	<Route path="/news" component={NewsAndEvents} />
        	<Route path="/PlatformInfo" component={PlatformInfo} />
          <Route path="/SignUp" component={signUp} />
        	<Route path="/Login" component={Login} />
          <Route path="/DefenseAppDashboard" component={defenseAppDashboard}/>
          <Route path="/resources" component={Resources} />
          <Route path="/adminpanel" component={AdminPanel} />
        </Switch>
    </UserProvider>
  );
}



export default App;
