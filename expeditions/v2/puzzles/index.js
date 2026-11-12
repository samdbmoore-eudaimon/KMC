import {registerPuzzleHooks} from '../puzzle-hooks.js';
import {sudokuHooks,solvePuzzle as solveSudoku} from './sudoku.js';
import {rotationHooks,solvePuzzle as solveRotation} from './rotation.js';
import {balanceHooks,solvePuzzle as solveBalance} from './balance.js';
import {nonogramHooks,solvePuzzle as solveNonogram} from './nonogram.js';
import {packingHooks,solvePuzzle as solvePacking} from './packing.js';
const entries={sudoku4:[sudokuHooks,solveSudoku],'equation-wheels':[rotationHooks,solveRotation],balance:[balanceHooks,solveBalance],nonogram5:[nonogramHooks,solveNonogram],polyhex:[packingHooks,solvePacking]};
export function registerOrchardPuzzleHooks(){for(const [kind,[hooks]]of Object.entries(entries))registerPuzzleHooks(kind,hooks);}
export function solvePuzzle(puzzle,options){const entry=entries[puzzle.kind];return entry?entry[1](puzzle,options):{status:'failure',reasonCode:'puzzle-kind',solutions:[],nodes:0};}
export const ORCHARD_PUZZLE_HOOKS=Object.fromEntries(Object.entries(entries).map(([kind,[hooks]])=>[kind,hooks]));
