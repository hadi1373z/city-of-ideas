// Original study prompts, not Escher quotations or reconstructions.
export const PRINT_STUDIES=Object.freeze({
 'ascending-descending':{title:'Ascending and Descending',experiment:'loop',question:'Can four rising flights return to their starting landing?',route:'Walk west through the perspective chamber into the hall. Take the south stair down, then approach the stair model.',link:'Test the closed-stair problem'},
 relativity:{title:'Relativity',experiment:'perspective',question:'Does one convincing view determine a unique spatial arrangement?',route:'Walk west into the perspective chamber. Compare the three brass viewing marks beside the rods.',link:'Test what a viewpoint can establish'},
 'drawing-hands':{title:'Drawing Hands',experiment:'reading',question:'If two things depend on each other, can either be constructed first?',route:'Stay in the room of three doors. Approach the reading desk on its north side.',link:'Test a circular dependency'},
 waterfall:{title:'Waterfall',experiment:'perspective',question:'Can apparent connections in an image hide separated depths?',route:'Walk west into the perspective chamber. Step between the brass viewing marks and watch the corners separate.',link:'Test apparent connections'}
});
export function dependencyOrder(aNeedsB,bNeedsA){return aNeedsB&&bNeedsA?null:aNeedsB?['B','A']:bNeedsA?['A','B']:['A and B independently'];}
