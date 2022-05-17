export const endpoint = "http://192.168.86.25:5000";

export type RootStackParamList = {
  Home: undefined;
  "Login/Sign Up": undefined;
};

export interface UserAuth {
  username: string;
  access_token: string;
  refresh_token: string;
}
