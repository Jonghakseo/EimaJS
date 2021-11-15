import React from "react";
import { render, Text, Box, Static } from "ink";

const Help = ({ msg }) => (
  <Static items={["1"]}>
    {(value) => (
      <Box key={value}>
        <Text color="yellow">{`[EIMA] : ${msg}`}</Text>
      </Box>
    )}
  </Static>
);

const Message = ({ msg }) => (
  <Static items={["2"]}>
    {(value) => (
      <Box key={value}>
        <Text color="blue">[EimaJS] :</Text>
        <Text color="rgb(43,210,131)">{` ${msg}`}</Text>
      </Box>
    )}
  </Static>
);

export function msg() {
  render(<Message msg={[...arguments]} />).cleanup();
}

export function help() {
  render(<Help msg={[...arguments]} />).cleanup();
}

export function log() {
  console.info("[EIMA] :", ...arguments);
}
