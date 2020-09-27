import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./App.css";
import Infobox from "./Infobox";
import LineGraph from "./LineGraph";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5, lng: 82.5 });
  const [mapZoom, setMapZoom] = useState(3.5);
  const handleChange = async (e) => {
    e.preventDefault();
    const countryCode = e.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setMapCountries(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, [countries]);
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropDown">
            <Select onChange={handleChange} variant="standard" value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <Infobox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            total={countryInfo.cases}
            cases={countryInfo.todayCases}
          />
          <Infobox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={countryInfo.recovered}
            cases={countryInfo.todayRecovered}
          />
          <Infobox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            total={countryInfo.deaths}
            cases={countryInfo.todayDeaths}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <div className="bottom">
            <h3>
              Worldwide {""}
              {casesType === "cases"
                ? `New Cases`
                : casesType !== "cases" && `${casesType}`}
            </h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
