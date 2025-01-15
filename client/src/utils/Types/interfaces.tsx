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
export type User = {
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

export type PendingUserCardProps = {
  index: number;
  request: User;
  authenticateReq: (id: string, status: boolean) => Promise<void>;
};

export type ListUserCardProps = {
  index: number;
  user: User;
};

// Farmer
export type FarmList = {
  userId: string;
  farm: string;
  geoFenceData: { lat: number; lng: number }[];
  crop: {
    name: string;
    ploughingDate?: string;
    weedingDate?: string;
    sowingDate?: string;
    floweringDate?: string;
    pheromoneTrapDate?: string;
    lureChangeDate?: string;
    irrigationDates: {
      artificial: string[];
      natural: string[];
    };
    fertilizerApplications: {
      date: string;
      volume: number;
    }[];
    pesticideApplications: {
      date: string;
      volume: number;
    }[];
    bagging: {
      date: string;
      quantity: number;
    }[];
    specialCare: {
      date: string;
      name: string;
    }[];
    harvest?: {
      date: string;
      yield: number;
    };
  };
  createdAt: string;
};

export type ListFarmCardProps = {
  idx: number;
  farm: FarmList;
  handleClick: (farm: FarmList) => Promise<void>;
};

export type MapProps = {
  submitForm: (coordinates: [number, number][]) => Promise<void>;
};
