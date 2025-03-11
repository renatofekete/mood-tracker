import {useContext} from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router';

export default function Login() {
    const authContext = useContext(AuthContext);
    
    if(!authContext) {
      return <div>Loading...</div>;
    }
    
    const {session, handleLogout, supabase} = authContext;

    if (!session) {
      return (<Auth providers={['google']} onlyThirdPartyProviders={true} showLinks={false} supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
    }
    else {
      return (<div>Logged in! {session.user?.user_metadata.name}<button onClick={handleLogout}>Logout</button> <Link to={"/"}>Home</Link></div>)
    }
}