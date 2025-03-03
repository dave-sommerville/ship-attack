'use strict';

const var00 = select(".00");
const var01 = select(".01");
const var02 = select(".02");
const var03 = select(".03");
const var04 = select(".04");
const var05 = select(".05");
const var06 = select(".06");
const var07 = select(".07");
const var08 = select(".08");
const var09 = select(".09");
const var10 = select(".10");
const var11 = select(".11");
const var12 = select(".12");
const var13 = select(".13");
const var14 = select(".14");
const var15 = select(".15");
const var16 = select(".16");
const var17 = select(".17");
const var18 = select(".18");
const var19 = select(".19");
const var20 = select(".20");
const var21 = select(".21");
const var22 = select(".22");
const var23 = select(".23");
const var24 = select(".24");
const var25 = select(".25");
const var26 = select(".26");
const var27 = select(".27");
const var28 = select(".28");
const var29 = select(".29");
const var30 = select(".30");
const var31 = select(".31");
const var32 = select(".32");
const var33 = select(".33");
const var34 = select(".34");
const var35 = select(".35");
const var36 = select(".36");
const var37 = select(".37");
const var38 = select(".38");
const var39 = select(".39");
const var40 = select(".40");
const var41 = select(".41");
const var42 = select(".42");
const var43 = select(".43");
const var44 = select(".44");
const var45 = select(".45");
const var46 = select(".46");
const var47 = select(".47");
const var48 = select(".48");
const var49 = select(".49");
const var50 = select(".50");
const var51 = select(".51");
const var52 = select(".52");
const var53 = select(".53");
const var54 = select(".54");
const var55 = select(".55");
const var56 = select(".56");
const var57 = select(".57");
const var58 = select(".58");
const var59 = select(".59");
const var60 = select(".60");
const var61 = select(".61");
const var62 = select(".62");
const var63 = select(".63");
const var64 = select(".64");
const var65 = select(".65");
const var66 = select(".66");
const var67 = select(".67");
const var68 = select(".68");
const var69 = select(".69");
const var70 = select(".70");
const var71 = select(".71");
const var72 = select(".72");
const var73 = select(".73");
const var74 = select(".74");
const var75 = select(".75");
const var76 = select(".76");
const var77 = select(".77");
const var78 = select(".78");
const var79 = select(".79");
const var80 = select(".80");
const var81 = select(".81");
const var82 = select(".82");
const var83 = select(".83");
const var84 = select(".84");
const var85 = select(".85");
const var86 = select(".86");
const var87 = select(".87");
const var88 = select(".88");
const var89 = select(".89");
const var90 = select(".90");
const var91 = select(".91");
const var92 = select(".92");
const var93 = select(".93");
const var94 = select(".94");
const var95 = select(".95");
const var96 = select(".96");
const var97 = select(".97");
const var98 = select(".98");
const var99 = select(".99");

const submarine = new Ship();
submarine.name = "Submarine";
submarine.size = 3;
submarine.boundary = 6;
const battleship = new Ship();
battleship.name = "Battleship";
battleship.size = 4;
battleship.boundary = 5;
const carrier = new Ship();
carrier.name = "Carrier";
carrier.size = 5;
carrier.boundary = 4;
const cruiser = new Ship();
cruiser.name = "Cruiser";
cruiser.size = 3;
cruiser.boundary = 6;
const destroyer = new Ship();
destroyer.name = "Destroyer";
destroyer.size = 2;
destroyer.boundary = 7;
let isVertical = false;


/*
      INTERFACE DESIGN  
    - Five ship buttons after game reset 
    - Button Listener adds certain ship to temperary variable 
    - Also triggers vertical vs horizontal prompt
    - Only x and y left to set
    - All ship array areas need to change color (including with hover if possible)
    - Limitations must be placed on clickable areas (Listeners can be turned off)
*/