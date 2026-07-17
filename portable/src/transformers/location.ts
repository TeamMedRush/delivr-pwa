import { LocationData } from "@interfaces/location";

interface RawData {
  data: {
    place_id: string;
    licence: string;
    osm_type: string;
    osm_id: string;
    lat: string;
    lon: string;
    place_rank: string;
    category: string;
    type: string;
    importance: string;
    addresstype: string;
    display_name: string;
    name: string;

    boundingbox: [
      string,
      string,
      string,
      string,
    ];

    address: {
      road: string;
      village: string;
      state_district: string;
      state: string;
      postcode: string;
      country: string;
      country_code: string;
    },
  };
}

export function transformLocFriendlyName(raw: unknown): LocationData {
  const data = (raw as RawData).data;

  return {
    friendlyName: data.display_name,
    address: {
      road: data.address.road,
      village: data.address.village,
      district: data.address.state_district,
      state: data.address.state,
      postcode: data.address.postcode,
      country: data.address.country,
    },
  };
}

