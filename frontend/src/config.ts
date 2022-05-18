export const endpoint = "http://10.21.122.84:5000";
export type RootStackParamList = {
  Home: undefined;
  "Login/Sign Up": undefined;
};

export interface UserAuth {
  username: string;
  access_token: string;
  refresh_token: string;
}

export interface Lawyer {
  username: string;
  title: string;
  tags: string[];
  description: string;
}
