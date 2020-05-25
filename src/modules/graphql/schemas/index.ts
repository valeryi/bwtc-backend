import { mergeTypes, fileLoader } from "merge-graphql-schemas";
import path from 'path';

const typeArray = fileLoader(path.join(__dirname, '**/*.graphql'));
const merged = mergeTypes(typeArray);
const noEmpty = merged.replace(/(_: +Boolean)/g, '');

export const readySchema = noEmpty;