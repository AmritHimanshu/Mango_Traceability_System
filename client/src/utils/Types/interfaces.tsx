// userSlice
export type userSchema = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Manager" | "Farmer";
  isAuthenticated: boolean;
  isRejected: boolean;
};

export type IUserState = {
  userState: userSchema | null;
};


// Headers
export type HeaderMenuProps = {
  onNavigationComplete: () => void;
};

export type HandleOnClickProps = {
  handleOnClick: (url: string) => void;
};


// Admin
export type pendingRequests = {
  createdAt: string;
  email: string;
  isAuthenticated: boolean;
  isRejected: boolean;
  name: string;
  phone: number;
  role: string;
  _id: string;
};

export type HomeCardProps = {
  title: string;
  description: string;
  count: number;
  textColor: string;
};

export type UserCardProps = {
  index: number;
  request: pendingRequests;
  authenticateReq: (id: string, status: boolean) => void;
}