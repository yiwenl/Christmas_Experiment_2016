import Animal from './Animal';

class Rabbit extends Animal {
  constructor(pos){
    let v = [
      [629, 499, 0],[657, 464, 0],[654, 443, 0],[637, 429, 0],[622, 431, 0],[621, 454, 0],[644, 469, 0],[651, 459, 0],[629, 417, 0],[623, 395, 0],[618, 355, 0],[608, 343, 0],[593, 341, 0],[573, 355, 0],[560, 355, 0],[555, 342, 0],[566, 319, 0],[569, 309, 0],[562, 306, 0],[547, 296, 0],[526, 279, 0],[511, 281, 0],[495, 307, 0],[490, 311, 0],[498, 326, 0],[503, 346, 0],[502, 358, 0],[506, 362, 0],[514, 360, 0],[518, 351, 0],[510, 347, 0],[502, 355, 0],[509, 369, 0],[528, 372, 0],[543, 357, 0],[542, 349, 0],[526, 346, 0],[515, 351, 0],[520, 376, 0],[548, 415, 0],[566, 418, 0],[589, 414, 0],[600, 403, 0],[587, 401, 0],[572, 406, 0],[570, 424, 0],[628, 470, 0],[644, 479, 0],[665, 482, 0],[677, 475, 0],[674, 458, 0],[659, 452, 0],[638, 454, 0],[626, 453, 0],[592, 418, 0],[591, 401, 0],[600, 388, 0],[611, 393, 0],[623, 445, 0],[643, 468, 0],[649, 459, 0],[627, 398, 0],[612, 367, 0],[613, 342, 0],[618, 307, 0],[615, 238, 0],[620, 218, 0],[629, 225, 0],[625, 248, 0],[613, 299, 0],[616, 323, 0],[629, 337, 0],[648, 341, 0],[643, 379, 0],[649, 430, 0],[661, 444, 0],[664, 437, 0],[666, 363, 0],[667, 339, 0],[661, 335, 0],[649, 334, 0],[648, 327, 0],[650, 303, 0],[640, 251, 0],[625, 217, 0],[613, 201, 0],[590, 194, 0],[575, 183, 0],[581, 169, 0],[594, 176, 0],[592, 185, 0],[555, 204, 0],[541, 222, 0],[537, 252, 0],[545, 281, 0],[551, 295, 0],[545, 308, 0],[530, 312, 0],[526, 302, 0],[533, 295, 0],[538, 302, 0],[529, 319, 0],[503, 291, 0],[478, 268, 0],[467, 251, 0],[452, 162, 0],[460, 146, 0],[468, 150, 0],[482, 188, 0],[489, 233, 0],[501, 257, 0],[517, 273, 0],[519, 281, 0],[511, 279, 0],[492, 220, 0],[480, 145, 0],[484, 128, 0],[502, 137, 0],[520, 167, 0],[529, 212, 0],[529, 245, 0],[532, 269, 0],[537, 285, 0],[533, 287, 0],[516, 269, 0],[499, 219, 0],[487, 172, 0],[486, 143, 0],[495, 130, 0],[524, 109, 0],[549, 85, 0]
    ]

    super(v, pos || [0, -3, 0])


  }
}

export default Rabbit;
