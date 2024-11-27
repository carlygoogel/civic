export interface StateGeoJSONData {
  type: "FeatureCollection";
  features: StateGeoJSONFeature[];
}

export interface StateGeoJSONFeature {
  id?: string | number | undefined;
  type: "Feature";
  properties: {
    name: string;
    abbr: string;
    density: number;
  };
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
}

export interface CountyGeoJSONData {
  type: "FeatureCollection";
  name: string;
  crs: {
    type: "name";
    properties: {
      name: string;
    };
  };
  features: {
    type: "Feature";
    properties: {
      AFFGEOID: string;
      ALAND: number;
      AWATER: number;
      COUNTYFP: string;
      COUNTYNS: string;
      GEOID: string;
      LSAD: string;
      NAME: string;
      STATEFP: string;
      state: string;
    };
    geometry: {
      type: "Polygon";
      coordinates: [number, number][][];
    };
  }[];
}

export interface Email {
  id: string;
  subject: string;
  message: string;
  name: string;
  city: string;
  phone: string;
  address: string;
  created_at: string;
  topics?: string[];
  needs_processing?: boolean;
  sentiment?: number;
  relevant_bills?: string[];
  needs_manual_topic_classification?: boolean;
}

export interface DashboardMetric {
  title: string;
  value: string | number;
  trend?: number[];
}

export interface TopicCount {
  name: string;
  value: number;
}

export interface EmailFormData {
  prefix: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phoneNumber: string;
  messageSubject: string;
  messageBody: string;
  topic: string;
}

export type Topic =
  | "Abortion"
  | "Agriculture"
  | "Animal Rights"
  | "Appropriations"
  | "Athletics and Sports"
  | "Banking and Financial Services"
  | "Border Security"
  | "Budget"
  | "Campaign Finance Reform"
  | "Child Abuse"
  | "Child Welfare and Health"
  | "Civil Liberties/Privacy"
  | "Climate Change"
  | "Commerce"
  | "Community/Economic Development"
  | "Consumer Protection"
  | "COVID Relief"
  | "Debt Ceiling"
  | "Defense and Military"
  | "Disabilities"
  | "Education"
  | "Election Security"
  | "Energy"
  | "Environment"
  | "Ethics and Rules"
  | "Foreign Affairs"
  | "Guns"
  | "Healthcare"
  | "Homeland Security"
  | "Housing"
  | "Immigration"
  | "Intelligence"
  | "Interior"
  | "Judges"
  | "Judiciary"
  | "Labor"
  | "Law Enforcement"
  | "Native Americans"
  | "Nutrition"
  | "Postal Service"
  | "Refugees"
  | "Science and Innovation"
  | "Senior Citizens"
  | "Social Security and Retirement"
  | "Surveillance"
  | "Taxes"
  | "Technology"
  | "Trade"
  | "Transportation"
  | "Veterans"
  | "Voting Rights";
