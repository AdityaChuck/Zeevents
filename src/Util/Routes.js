import { Switch, Route, Redirect } from "react-router-dom";
import Auth from "../pages/Auth";
import Bookings from "../pages/Bookings";
import CreateEvent from "../pages/CreateEvent";
import Events from "../pages/Events";
import useSelectors from "../Util/hooks/selector";

const Routes = () => {
  const { isLoggedIn } = useSelectors();

  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to={isLoggedIn ? "/events" : "/authentication/signin"}
      />
      {!isLoggedIn && (
        <Route exact path="/authentication/:page" component={Auth} />
      )}
      <Route exact path="/events" component={Events} />
      <Route exact path="/events/create-new" component={CreateEvent} />
      <Route exact path="/bookings" component={Bookings} />
    </Switch>
  );
};

export default Routes;
