// fireabase user authentication using email and passowrord
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/database';

export const login = async (email: string, password: string) => {
  const auth = getAuth(app);
  return signInWithEmailAndPassword(
    auth,
    email,
    password
  );
};
