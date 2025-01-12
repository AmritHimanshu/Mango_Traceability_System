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
  name: string;
  phone: number;
  role: string;
  _id: string;
}

export type HomeCardProps = {
  title: string;
  description: number;
  textColor: string;
}