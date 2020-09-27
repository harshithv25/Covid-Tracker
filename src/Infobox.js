import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./Infobox.css";
import { prettier } from "./util";

function Infobox({ title, cases, active, isRed, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        <Typography
          className={`infoBox__title ${isRed && "infoBox__title--red"}`}
          color="textSecondary"
        >
          {title}
        </Typography>
        <h2
          className={`infoBox__case ${!isRed && "infoBox__cases--green"}`}
          color="danger"
        >
          {`+${prettier(cases)}`}
        </h2>
        <Typography className="infoBox__total" color="textSecondary">
          Total: {prettier(total)}{" "}
          {title === "Coronavirus Cases"
            ? "Cases"
            : title === "Recovered"
            ? "Recovered"
            : "Deaths"}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Infobox;
