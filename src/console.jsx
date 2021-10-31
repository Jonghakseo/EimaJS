import React from "react";
import { render, Text } from "ink";

const Help = ({ msg }) => {
  return (
    <Text>
      <Text color={"yellow"}>{`[EimaJS] : ${msg}`}</Text>
    </Text>
  );
};

const Message = ({ msg }) => {
  return (
    <Text>
      <Text color={"blue"}>[EimaJS] :</Text>
      <Text color={"rgb(43,210,131)"}>{` ${msg}`}</Text>
    </Text>
  );
};

export function msg() {
  render(<Message msg={[...arguments]} />);
  // console.info("[EimaJS] :", ...arguments);
}

export function help() {
  render(<Help msg={[...arguments]} />);
}

export function log() {
  console.info("[EimaJS] :", ...arguments);
}
