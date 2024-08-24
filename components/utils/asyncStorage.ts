// import AsyncStorage from '@react-native-async-storage/async-storage'

// Save login state
// export const saveLoginState = async (userToken:string) => {
//   try {
//     await AsyncStorage.setItem('userToken', userToken);
//   } catch (error) {
//     console.error('Error saving login state:', error);
//   }
// };

// // Get login state
// export const getLoginState = async () => {
//   try {
//     const userToken = await AsyncStorage.getItem('userToken');
//     return userToken;
//   } catch (error) {
//     console.error('Error retrieving login state:', error);
//     return null;
//   }
// };

// // Remove login state
// export const removeLoginState = async () => {
//   try {
//     await AsyncStorage.removeItem('userToken');
//   } catch (error) {
//     console.error('Error removing login state:', error);
//   }
// };