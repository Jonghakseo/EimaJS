import React from "react";
import { render, Text, Box, Static } from "ink";
import { EIMA } from "./constants";

const Help = ({ msg }) => (
  <Static items={["help"]}>
    {(value) => (
      <Box key={value}>
        <Text color="yellow">{`[${EIMA}] : ${msg}`}</Text>
      </Box>
    )}
  </Static>
);

const Error = ({ msg }) => (
  <Static items={["error"]}>
    {(value) => (
      <Box key={value}>
        <Text color="red">{`[${EIMA}] : ${msg}`}</Text>
      </Box>
    )}
  </Static>
);

const Message = ({ msg }) => (
  <Static items={["msg"]}>
    {(value) => (
      <Box key={value}>
        <Text color="blue">[{EIMA}] : </Text>
        <Text color="rgb(43,210,131)">{`${msg}`}</Text>
      </Box>
    )}
  </Static>
);

const BoxMessage = ({ msg }) => (
  <Static items={["box"]}>
    {(value) => (
      <Box key={value} borderStyle="double" paddingX={2}>
        <Text color="rgb(43,210,131)">{`${msg}`}</Text>
      </Box>
    )}
  </Static>
);

const Log = ({ msg }) => (
  <Static items={["log"]}>
    {(value) => (
      <Box key={value}>
        <Text color="grey">[{EIMA}] :</Text>
        <Text color="yellow" dimColor>{` ${msg}`}</Text>
      </Box>
    )}
  </Static>
);

export function box() {
  render(<BoxMessage msg={[...arguments]} />).cleanup();
}

export function msg() {
  render(<Message msg={[...arguments]} />).cleanup();
}

export function help() {
  render(<Help msg={[...arguments]} />).cleanup();
}
export function err() {
  render(<Error msg={[...arguments]} />).cleanup();
}

export function log() {
  render(<Log msg={[...arguments]} />).cleanup();
}
