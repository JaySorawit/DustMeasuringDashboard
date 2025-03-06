export interface DustMeasurement {
  measurement_id: number;
  measurement_datetime: string;
  room: string;
  area: string;
  location_name: string;
  dust_value: number;
  dust_type: number;
  count: number;
  alarm_high: number;
  running_state: number;
}

export interface FetchedData {
  measurement_id: number;
  measurement_datetime: string;
  room: string;
  area: string;
  location_name: string;
  count: number;
  running_state: number;
  alarm_high: number;
  um01?: number;
  um03?: number;
  um05?: number;
}