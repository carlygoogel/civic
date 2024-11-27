/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from "@supabase/supabase-js";
import {
  stateNameToAbbrev,
  stateNumToName,
  normalizeState,
  // getStateColor,
} from "../utils/index";
import { StateGeoJSONData, CountyGeoJSONData } from "../utils/types";
import { GeoJSONSource } from "mapbox-gl";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const HeatMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [emailData, setEmailData] = useState<{ [key: string]: number }>({});
  const mapInitialized = useRef(false);

  // State name to abbreviation mapping MOVED TO ..utils/index.ts

  const fetchEmailData = async () => {
    const { data } = await supabase.from("Emails").select("state");

    const stateCounts = data?.reduce((acc, { state }) => {
      if (state) {
        const normalizedState = normalizeState(state as string);
        acc[normalizedState] = (acc[normalizedState] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    console.log("Normalized state counts:", stateCounts);
    setEmailData(stateCounts || {});
    if (map.current) {
      await updateMapData(stateCounts || {});
    } else {
      initializeMap(stateCounts || {});
    }
  };

  const statesLayerSetup = async (data: { [key: string]: number }) => {
    const statesData: StateGeoJSONData = await statesDataParse();
    statesLayerHandling(statesData);
    statesPopupSetup(data);
  };

  const countyLayerSetup = async () => {
    const countiesData: CountyGeoJSONData = await countiesDataParse();
    countiesLayerHandling(countiesData);
    // TODO: Add county popup setup
  };

  const initializeMap = (data: { [key: string]: number }) => {
    if (!mapContainer.current || mapInitialized.current) return;
    mapInitialized.current = true;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-98.5795, 39.8283],
      projection: "mercator",
      zoom: 3,
    });

    map.current.on("load", async () => {
      await statesLayerSetup(data);
      await countyLayerSetup();
    });
  };

  const updateMapData = async (data: { [key: string]: number }) => {
    await statesLayerSetup(data);
    await countyLayerSetup();
  };

  useEffect(() => {
    void fetchEmailData();
    return () => {
      if (map.current) {
        map.current.remove();
        mapInitialized.current = false;
      }
    };
  }, []);

  const getFirstSymbolId = () => {
    const layers = map.current?.getStyle()?.layers || [];
    for (const layer of layers) {
      if (layer.type === "symbol") {
        return layer.id;
      }
    }
    return undefined;
  };

  const statesDataParse = async (): Promise<StateGeoJSONData> => {
    const response = await fetch(
      "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json"
    );
    const statesData: StateGeoJSONData =
      (await response.json()) as StateGeoJSONData;

    statesData.features = statesData.features.map((feature) => {
      const stateName = feature.properties.name.toUpperCase();
      const abbr = stateNameToAbbrev[stateName] || feature.properties.name;
      return {
        ...feature,
        properties: {
          ...feature.properties,
          abbr: abbr,
          name: feature.properties.name,
        },
      };
    });

    return statesData;
  };

  const statesLayerHandling = (statesData: StateGeoJSONData) => {
    const firstSymbolId = getFirstSymbolId();
    const stateSource: GeoJSONSource | undefined =
      map.current?.getSource("states");
    if (stateSource) {
      stateSource.setData(statesData);
    } else {
      map.current?.addSource("states", {
        type: "geojson",
        data: statesData,
      });

      map.current?.addLayer(
        {
          id: "state-fills",
          type: "fill",
          source: "states",
          paint: {
            "fill-color":
              // [
              // "match",
              // ["get", "abbr"],
              // ...Object.entries(emailData).flatMap(([state, count]) => [
              //   state,
              //   getStateColor(count),
              // ]),
              "#eee",
            // ],
            "fill-opacity": 0.7,
          },
        },
        firstSymbolId
      );

      map.current?.addLayer(
        {
          id: "state-borders",
          type: "line",
          source: "states",
          paint: {
            "line-color": "#666",
            "line-width": 1,
          },
        },
        firstSymbolId
      );
    }
    return statesData;
  };

  const statesPopupSetup = (data: { [key: string]: number }) => {
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.current?.on("mousemove", "state-fills", (e) => {
      if (e.features?.length) {
        const feature = e.features[0];
        const abbr = feature.properties?.abbr;
        const name = feature.properties?.name;
        const count = data[abbr] || 0;

        popup
          .setLngLat(e.lngLat)
          .setHTML(
            `
              <strong>${name} (${abbr})</strong><br/>
              Emails: ${count}
            `
          )
          .addTo(map.current!);
      }
    });

    map.current?.on("mouseleave", "state-fills", () => {
      popup.remove();
    });
  };

  const countiesDataParse = async (): Promise<CountyGeoJSONData> => {
    const response = await fetch(
      "https://gist.githubusercontent.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a/raw/e89c35f308cee7e2e5a784e1d3afc5d449e9e4bb/counties.geojson"
    );
    const countiesData: CountyGeoJSONData =
      (await response.json()) as CountyGeoJSONData;

    countiesData.features = countiesData.features.map((feature) => {
      const stateNum = feature.properties.STATEFP;
      const state = stateNumToName[stateNum] || feature.properties.STATEFP;
      return {
        ...feature,
        properties: {
          ...feature.properties,
          STATE: state,
        },
      };
    });

    console.log("Counties data:", countiesData);
    return countiesData;
  };

  const countiesLayerHandling = (countiesData: CountyGeoJSONData) => {
    const firstSymbolId = getFirstSymbolId();
    const countySource = map.current?.getSource(
      "counties"
    ) as mapboxgl.GeoJSONSource;

    if (countySource) {
      countySource.setData(countiesData);
    } else {
      map.current?.addSource("counties", {
        type: "geojson",
        data: countiesData,
      });

      map.current?.addLayer(
        {
          id: "county-fills",
          type: "fill",
          source: "counties",
          paint: {
            "fill-color": "#eee",
            "fill-opacity": 0.5,
          },
        },
        firstSymbolId
      );

      map.current?.addLayer(
        {
          id: "county-borders",
          type: "line",
          source: "counties",
          paint: {
            "line-color": "#666",
            "line-width": 1,
          },
        },
        firstSymbolId
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-sm text-gray-500 font-medium mb-4">
        Email Volume by State
      </h3>

      <div className="relative">
        <div ref={mapContainer} className="w-full h-[400px] rounded-lg" />

        <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
          <div className="text-xs text-gray-500 mb-1">Email Count Scale</div>
          <div className="h-2 w-32 bg-gradient-to-r from-blue-50 via-blue-500 to-blue-900 rounded" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>5</span>
            <span>10+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
