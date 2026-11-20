// Original study prompts, not Escher quotations or reconstructions.
export const PRINT_STUDIES=Object.freeze({
 'ascending-descending':{title:'Ascending and Descending',experiment:'loop',question:'Can four rising flights return to their starting landing?',route:'Enter the central vaulted court. Take its south stair down to the lower hexagonal cloister, then approach the stair model.',link:'Test the closed-stair problem'},
 relativity:{title:'Relativity',experiment:'perspective',question:'Does one convincing view determine a unique spatial arrangement?',route:'Cross the central court to the west Perspective wing. Take the aisle around the case to its three brass viewing marks.',link:'Test what a viewpoint can establish'},
 'drawing-hands':{title:'Drawing Hands',experiment:'reading',question:'If two things depend on each other, can either be constructed first?',route:'From the central court, enter the southeast Topology & relations wing. Approach the reading desk on its north side.',link:'Test a circular dependency'},
 waterfall:{title:'Waterfall',experiment:'perspective',question:'Can apparent connections in an image hide separated depths?',route:'Cross the central court to the west Perspective wing. Step between its brass viewing marks and watch the corners separate.',link:'Test apparent connections'}
});
export function dependencyOrder(aNeedsB,bNeedsA){return aNeedsB&&bNeedsA?null:aNeedsB?['B','A']:bNeedsA?['A','B']:['A and B independently'];}
