// import * as Google from 'expo-auth-session/providers/google';
// import { getAuth, signInWithCredential, GoogleAuthProvider, Auth, UserCredential } from 'firebase/auth';
// import { auth } from './firebaseConfig'

// // Function to handle Google Sign-In
// export const useGoogleSignIn = () => {
//   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
//     clientId: '799013023999-shm138aqdlbri316ee7jgifuk0ef5gpf.apps.googleusercontent.com',
//   });

//   const handleGoogleSignIn = async (): Promise<UserCredential | null> => {
//     if (response?.type === 'success' && response.params.id_token) {
//       const { id_token } = response.params;

//       try {
//         const credential = GoogleAuthProvider.credential(id_token);
//         const userCredential = await signInWithCredential(auth, credential);
//         console.log('Google Sign-In successful:', userCredential);
//         return userCredential;
//       } catch (error) {
//         console.error('Error during Google Sign-In:', error);
//         return null;
//       }
//     }

//     // If the response is not successful, return null
//     return null;
//   };

//   return { request, response, promptAsync, handleGoogleSignIn };
// };
