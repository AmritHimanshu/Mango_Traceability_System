// userSlice
export type userSchema = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Manager" | "Farmer";
  isAuthenticated: boolean;
  isRejected: boolean;
  uniqueID: string;
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
  uniqueID: string;
};

export type HomeCardProps = {
  title: string;
  description: string;
  count: number;
  textColor: string;
};

export type PendingUserTableProps = {
  user: User;
  authenticateReq: (id: string, role: string, status: boolean) => Promise<void>;
};

// Farmer
export type Farm = {
  userId: { name: string; email: string; phone: string };
  farm: string;
  geoFenceData: { lat: number; lng: number }[];
  area: number;
  crop: string;
  ploughingDate: string;
  weedingDate: string[];
  sowingDate: string;
  floweringDate: string;
  pheromoneTrapDate: string;
  lureChangeDate: string;
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
  harvest: {
    date: string;
    yield: number;
  };
  createdAt: string;
};

export type FarmList = {
  userId: string;
  farm: string;
  crop: string;
  createdAt: string;
  _id: string;
  uniqueID: string;
};

export type FewFarmList = {
  crop: string;
  farm: string;
  geoFenceData: { lat: number; lng: number }[];
  _id: string;
};

export type ListFarmTableProps = {
  farms: FarmList[];
  handleClick: (id: string) => Promise<void>;
};

export type MapProps = {
  submitForm: (coordinates: [number, number][]) => Promise<void>;
};

export type MapCoordinatesProps = {
  coordinates: { lat: number; lng: number }[];
  height: string;
};

export type TableColumn = {
  header: string;
  key: string;
};

export type ListFarmApplicationsDataProps = {
  data: Array<Record<string, any>>;
  columns: TableColumn[];
};

export type farmerHomeCardProps = {
  data: FewFarmList;
};
