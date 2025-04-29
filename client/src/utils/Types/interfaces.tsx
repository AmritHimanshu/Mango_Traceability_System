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
  url: string;
};

export type PendingUserTableProps = {
  idx: number;
  user: User;
  confirmReq: (id: string, role: string, status: boolean) => void;
};

// Farmer
export type Farm = {
  userUniqueId: string;
  farm: string;
  geoFenceData: { lat: number; lng: number }[];
  area: number;
  crop: string;
  landmark: string;
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
  uniqueID: string;
};

export type FarmList = {
  userUniqueId: string;
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
  uniqueID: string;
};

export type ListFarmTableProps = {
  farms: FarmList[];
  idxCalc: number;
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

export type userCert = {
  name: string;
  email: string;
  phone: number;
};

export type bannerProps = {
  img_src: string;
  img_alt: string;
  heading: string | undefined;
  description: string | undefined;
};

interface WeatherData {
  temperature: string;
  weather: string;
  wind: number;
  humidity: number;
}

export type notification = {
  userUniqueId: string;
  farmAlerts: {
    block: string;
    currentAlert: WeatherData;
    forecastAlert: {
      [date: string]: WeatherData;
    };
  }[];
  createdAt: string;
};
