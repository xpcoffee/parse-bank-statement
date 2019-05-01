import * as fs from "fs";
import * as readline from "readline";
import { Statement, ParsingFunction, StatementParser } from "./types";

export const UKNOWN = "UNKNOWN";

export function getEmptyStatement(): Statement {
  return {
    account: UKNOWN,
    bank: UKNOWN,
    transactions: [],
    parsingErrors: [],
  };
}

/**
 * Given a line-parsing function, this returns a function that will parse a the file at a given path.
 *
 * @param parsingFunction The function to use to parse each line of the file.
 * @returns a function that, given a path to a file, will parse the file into a Statement object.
 */
export const getStatementParser = <T>(parsingFunction: ParsingFunction): StatementParser => async (
  filePath: string,
) => {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let memo = getEmptyStatement();
  for await (const line of rl) {
    memo = parsingFunction(line, memo);
  }
  return memo;
};