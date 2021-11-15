import React from "react";
import { render, Text, Box, Static } from "ink";

const Help = ({ msg }) => (
  <Static items={["help"]}>
    {(value) => (
      <Box key={value}>
        <Text color="yellow">{`[EIMA] : ${msg}`}</Text>
      </Box>
    )}
  </Static>
);

const Message = ({ msg }) => (
  <Static items={["msg"]}>
    {(value) => (
      <Box key={value}>
        <Text color="blue">[EIMA] :</Text>
        <Text color="rgb(43,210,131)">{` ${msg}`}</Text>
      </Box>
    )}
  </Static>
);

const Log = ({ msg }) => (
  <Static items={["log"]}>
    {(value) => (
      <Box key={value}>
        <Text color="grey">[EIMA] :</Text>
        <Text color="yellow" dimColor>{` ${msg}`}</Text>
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
  render(<Log msg={[...arguments]} />).cleanup();
  // console.info("[EIMA] :", ...arguments);
}
