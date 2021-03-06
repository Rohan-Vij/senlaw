// TODO: for dev only, change back
export const endpoint = "https://senlaw-api.herokuapp.com/";

export type RootStackParamList = {
  Home: undefined;
  "Login/Sign Up": undefined;
  Lawyer: { postId: string; }
};

export interface UserAuth {
  username: string;
  access_token: string;
  refresh_token: string;
}

export interface Lawyer {
  _id: string;
  username: string;
  title: string;
  tags: string[];
  description: string;
  contact: string;
}
