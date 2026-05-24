import type { PaletteColor } from '@/types'

// ============================================================
// 拼豆色盘 — 264 色（合并 Perler / Artkal / Hama 去重后扩展）
// ============================================================
const paletteColors: PaletteColor[] = [
  // ===== 白 / 黑 / 灰系 (12色) =====
  { code: 'B001', name: 'White',             hex: '#FFFFFF', rgb: [255, 255, 255] },
  { code: 'B002', name: 'Ivory',             hex: '#FFFFF0', rgb: [255, 255, 240] },
  { code: 'B003', name: 'Cream White',       hex: '#FFF9E6', rgb: [255, 249, 230] },
  { code: 'B004', name: 'Black',             hex: '#1A1A1A', rgb: [26, 26, 26] },
  { code: 'B005', name: 'Charcoal',          hex: '#3C3C3C', rgb: [60, 60, 60] },
  { code: 'B006', name: 'Slate',             hex: '#404040', rgb: [64, 64, 64] },
  { code: 'B007', name: 'Dark Grey',         hex: '#545454', rgb: [84, 84, 84] },
  { code: 'B008', name: 'Grey',              hex: '#808080', rgb: [128, 128, 128] },
  { code: 'B009', name: 'Light Grey',        hex: '#B0B0B0', rgb: [176, 176, 176] },
  { code: 'B010', name: 'Pale Grey',         hex: '#D0D0D0', rgb: [208, 208, 208] },
  { code: 'B011', name: 'Silver Grey',       hex: '#C0C0C0', rgb: [192, 192, 192] },
  { code: 'B012', name: 'Platinum',          hex: '#D5D5D5', rgb: [213, 213, 213] },

  // ===== 粉 / 玫红系 (16色) =====
  { code: 'B013', name: 'Baby Pink',         hex: '#FFD1DC', rgb: [255, 209, 220] },
  { code: 'B014', name: 'Blush Pink',        hex: '#FCE4EC', rgb: [252, 228, 236] },
  { code: 'B015', name: 'Bubblegum',         hex: '#FFC0CB', rgb: [255, 192, 203] },
  { code: 'B016', name: 'Light Pink',        hex: '#FFB6C1', rgb: [255, 182, 193] },
  { code: 'B017', name: 'Pink',              hex: '#FF85A2', rgb: [255, 133, 162] },
  { code: 'B018', name: 'Blush',             hex: '#F4A3AA', rgb: [244, 163, 170] },
  { code: 'B019', name: 'Salmon Pink',       hex: '#FF8A80', rgb: [255, 138, 128] },
  { code: 'B020', name: 'Flamingo',          hex: '#F48FB1', rgb: [244, 143, 177] },
  { code: 'B021', name: 'Rose',              hex: '#EC407A', rgb: [236, 64, 122] },
  { code: 'B022', name: 'Rose Pink',         hex: '#F06292', rgb: [240, 98, 146] },
  { code: 'B023', name: 'Hot Pink',          hex: '#FF69B4', rgb: [255, 105, 180] },
  { code: 'B024', name: 'Neon Pink',         hex: '#FF4090', rgb: [255, 64, 144] },
  { code: 'B025', name: 'Magenta',           hex: '#E54E8B', rgb: [229, 78, 139] },
  { code: 'B026', name: 'Fuchsia',           hex: '#D01089', rgb: [208, 16, 137] },
  { code: 'B027', name: 'Raspberry',         hex: '#C42871', rgb: [196, 40, 113] },
  { code: 'B028', name: 'Deep Magenta',      hex: '#C2185B', rgb: [194, 24, 91] },

  // ===== 红系 (12色) =====
  { code: 'B029', name: 'Pastel Red',        hex: '#FF6B6B', rgb: [255, 107, 107] },
  { code: 'B030', name: 'Coral Pink',        hex: '#FF5A5F', rgb: [255, 90, 95] },
  { code: 'B031', name: 'Coral Red',         hex: '#FF5252', rgb: [255, 82, 82] },
  { code: 'B032', name: 'Tomato',            hex: '#FF6347', rgb: [255, 99, 71] },
  { code: 'B033', name: 'Cherry',            hex: '#DE3163', rgb: [222, 49, 99] },
  { code: 'B034', name: 'Red',               hex: '#D62631', rgb: [214, 38, 49] },
  { code: 'B035', name: 'Crimson',           hex: '#DC143C', rgb: [220, 20, 60] },
  { code: 'B036', name: 'Deep Red',          hex: '#C62828', rgb: [198, 40, 40] },
  { code: 'B037', name: 'Dark Red',          hex: '#8B0000', rgb: [139, 0, 0] },
  { code: 'B038', name: 'Burgundy',          hex: '#722F37', rgb: [114, 47, 55] },
  { code: 'B039', name: 'Wine',              hex: '#8E2D3D', rgb: [142, 45, 61] },
  { code: 'B040', name: 'Brick Red',         hex: '#AA4A44', rgb: [170, 74, 68] },

  // ===== 橙系 (14色) =====
  { code: 'B041', name: 'Peach',             hex: '#FFDAB9', rgb: [255, 218, 185] },
  { code: 'B042', name: 'Apricot',           hex: '#FFAB91', rgb: [255, 171, 145] },
  { code: 'B043', name: 'Melon',             hex: '#FFB380', rgb: [255, 179, 128] },
  { code: 'B044', name: 'Butterscotch',      hex: '#F5A48C', rgb: [245, 164, 140] },
  { code: 'B045', name: 'Salmon',            hex: '#FA8072', rgb: [250, 128, 114] },
  { code: 'B046', name: 'Coral',             hex: '#FF7F50', rgb: [255, 127, 80] },
  { code: 'B047', name: 'Light Orange',      hex: '#FFB347', rgb: [255, 179, 71] },
  { code: 'B048', name: 'Tangerine',         hex: '#FFA726', rgb: [255, 167, 38] },
  { code: 'B049', name: 'Orange',            hex: '#FF8C00', rgb: [255, 140, 0] },
  { code: 'B050', name: 'Pumpkin',           hex: '#FF7518', rgb: [255, 117, 24] },
  { code: 'B051', name: 'Neon Orange',       hex: '#FF8040', rgb: [255, 128, 64] },
  { code: 'B052', name: 'Dark Orange',       hex: '#E65100', rgb: [230, 81, 0] },
  { code: 'B053', name: 'Burnt Orange',      hex: '#D2691E', rgb: [210, 105, 30] },
  { code: 'B054', name: 'Rust',              hex: '#D84315', rgb: [216, 67, 21] },

  // ===== 黄 / 金系 (16色) =====
  { code: 'B055', name: 'Cream',             hex: '#FFFDD0', rgb: [255, 253, 208] },
  { code: 'B056', name: 'Buttercream',       hex: '#FFFACD', rgb: [255, 250, 205] },
  { code: 'B057', name: 'Pale Cream',        hex: '#FFF8E1', rgb: [255, 248, 225] },
  { code: 'B058', name: 'Pastel Yellow',     hex: '#FFF9B0', rgb: [255, 249, 176] },
  { code: 'B059', name: 'Light Yellow',      hex: '#FFF9C4', rgb: [255, 249, 196] },
  { code: 'B060', name: 'Banana',            hex: '#FFFF66', rgb: [255, 255, 102] },
  { code: 'B061', name: 'Yellow',            hex: '#FFEB00', rgb: [255, 235, 0] },
  { code: 'B062', name: 'Neon Yellow',       hex: '#E0FF40', rgb: [224, 255, 64] },
  { code: 'B063', name: 'Lemon',             hex: '#FFEB3B', rgb: [255, 235, 59] },
  { code: 'B064', name: 'Golden Yellow',     hex: '#FFD54F', rgb: [255, 213, 79] },
  { code: 'B065', name: 'Amber',             hex: '#FFCA28', rgb: [255, 202, 40] },
  { code: 'B066', name: 'Cheddar',           hex: '#F6A413', rgb: [246, 164, 19] },
  { code: 'B067', name: 'Mustard',           hex: '#D5A51C', rgb: [213, 165, 28] },
  { code: 'B068', name: 'Gold',              hex: '#FFD700', rgb: [255, 215, 0] },
  { code: 'B069', name: 'Metallic Gold',     hex: '#D4AF37', rgb: [212, 175, 55] },
  { code: 'B070', name: 'Antique Gold',      hex: '#CFB53B', rgb: [207, 181, 59] },

  // ===== 绿系 (18色) =====
  { code: 'B071', name: 'Pastel Green',      hex: '#C8E6C9', rgb: [200, 230, 201] },
  { code: 'B072', name: 'Mint Green',        hex: '#98FB98', rgb: [152, 251, 152] },
  { code: 'B073', name: 'Light Green',       hex: '#95D5A0', rgb: [149, 213, 160] },
  { code: 'B074', name: 'Pale Green',        hex: '#90EE90', rgb: [144, 238, 144] },
  { code: 'B075', name: 'Spring Green',      hex: '#00FA9A', rgb: [0, 250, 154] },
  { code: 'B076', name: 'Neon Green',        hex: '#60FF60', rgb: [96, 255, 96] },
  { code: 'B077', name: 'Green',             hex: '#4CAF50', rgb: [76, 175, 80] },
  { code: 'B078', name: 'Lime',              hex: '#AEEA00', rgb: [174, 234, 0] },
  { code: 'B079', name: 'Kiwi Lime',         hex: '#C0E060', rgb: [192, 224, 96] },
  { code: 'B080', name: 'Chartreuse',        hex: '#AAD415', rgb: [170, 212, 21] },
  { code: 'B081', name: 'Leaf Green',        hex: '#43A047', rgb: [67, 160, 71] },
  { code: 'B082', name: 'Emerald',           hex: '#2ECC71', rgb: [46, 204, 113] },
  { code: 'B083', name: 'Forest Green',      hex: '#2D5A27', rgb: [45, 90, 39] },
  { code: 'B084', name: 'Dark Green',        hex: '#1B5E20', rgb: [27, 94, 32] },
  { code: 'B085', name: 'Pine Green',        hex: '#014E35', rgb: [1, 78, 53] },
  { code: 'B086', name: 'Olive',             hex: '#6B8E23', rgb: [107, 142, 35] },
  { code: 'B087', name: 'Sage',              hex: '#9CAF88', rgb: [156, 175, 136] },
  { code: 'B088', name: 'Prickly Pear',      hex: '#A8C878', rgb: [168, 200, 120] },

  // ===== 青 / 蓝绿系 (12色) =====
  { code: 'B089', name: 'Aqua',              hex: '#00FFFF', rgb: [0, 255, 255] },
  { code: 'B090', name: 'Light Cyan',        hex: '#B2EBF2', rgb: [178, 235, 242] },
  { code: 'B091', name: 'Cyan',              hex: '#00CED1', rgb: [0, 206, 209] },
  { code: 'B092', name: 'Toothpaste',        hex: '#7FE0E0', rgb: [127, 224, 224] },
  { code: 'B093', name: 'Turquoise',         hex: '#40E0D0', rgb: [64, 224, 208] },
  { code: 'B094', name: 'Seafoam',           hex: '#B2DFDB', rgb: [178, 223, 219] },
  { code: 'B095', name: 'Aquamarine',        hex: '#76D7C4', rgb: [118, 215, 196] },
  { code: 'B096', name: 'Robin\'s Egg',      hex: '#96DED1', rgb: [150, 222, 209] },
  { code: 'B097', name: 'Teal',              hex: '#008080', rgb: [0, 128, 128] },
  { code: 'B098', name: 'Deep Teal',         hex: '#00838F', rgb: [0, 131, 143] },
  { code: 'B099', name: 'Dark Teal',         hex: '#2C7A7B', rgb: [44, 122, 123] },
  { code: 'B100', name: 'Sea Green',         hex: '#2E8B57', rgb: [46, 139, 87] },

  // ===== 蓝系 (18色) =====
  { code: 'B101', name: 'Ice Blue',          hex: '#D4EFFF', rgb: [212, 239, 255] },
  { code: 'B102', name: 'Baby Blue',         hex: '#B3E5FC', rgb: [179, 229, 252] },
  { code: 'B103', name: 'Pastel Blue',       hex: '#BBDEFB', rgb: [187, 222, 251] },
  { code: 'B104', name: 'Light Blue',        hex: '#90CAF9', rgb: [144, 202, 249] },
  { code: 'B105', name: 'Sky Blue',          hex: '#87CEEB', rgb: [135, 206, 235] },
  { code: 'B106', name: 'Cornflower',        hex: '#6495ED', rgb: [100, 149, 237] },
  { code: 'B107', name: 'Periwinkle',        hex: '#CCCCFF', rgb: [204, 204, 255] },
  { code: 'B108', name: 'Dodger Blue',       hex: '#2196F3', rgb: [33, 150, 243] },
  { code: 'B109', name: 'Steel Blue',        hex: '#5C7DA6', rgb: [92, 125, 166] },
  { code: 'B110', name: 'Denim',             hex: '#507DAF', rgb: [80, 125, 175] },
  { code: 'B111', name: 'Blue',              hex: '#4169E1', rgb: [65, 105, 225] },
  { code: 'B112', name: 'Cerulean',          hex: '#1976D2', rgb: [25, 118, 210] },
  { code: 'B113', name: 'Royal Blue',        hex: '#1565C0', rgb: [21, 101, 192] },
  { code: 'B114', name: 'Dark Blue',         hex: '#1A4B8C', rgb: [26, 75, 140] },
  { code: 'B115', name: 'Navy Blue',         hex: '#1A237E', rgb: [26, 35, 126] },
  { code: 'B116', name: 'Navy',              hex: '#000080', rgb: [0, 0, 128] },
  { code: 'B117', name: 'Midnight Blue',     hex: '#0F1B4C', rgb: [15, 27, 76] },
  { code: 'B118', name: 'Deep Navy',         hex: '#0D1B4A', rgb: [13, 27, 74] },

  // ===== 紫系 (16色) =====
  { code: 'B119', name: 'Light Lavender',    hex: '#D8C8E8', rgb: [216, 200, 232] },
  { code: 'B120', name: 'Lavender',          hex: '#E1BEE7', rgb: [225, 190, 231] },
  { code: 'B121', name: 'Mauve',             hex: '#C49FD6', rgb: [196, 159, 214] },
  { code: 'B122', name: 'Lilac',             hex: '#BB8FCE', rgb: [187, 143, 206] },
  { code: 'B123', name: 'Orchid',            hex: '#DA70D6', rgb: [218, 112, 214] },
  { code: 'B124', name: 'Light Purple',      hex: '#CE93D8', rgb: [206, 147, 216] },
  { code: 'B125', name: 'Thistle',           hex: '#D8BFD8', rgb: [216, 191, 216] },
  { code: 'B126', name: 'Violet',            hex: '#EE82EE', rgb: [238, 130, 238] },
  { code: 'B127', name: 'Purple',            hex: '#9370DB', rgb: [147, 112, 219] },
  { code: 'B128', name: 'Deep Purple',       hex: '#784B8A', rgb: [120, 75, 138] },
  { code: 'B129', name: 'Plum',              hex: '#8B4367', rgb: [139, 67, 103] },
  { code: 'B130', name: 'Grape',             hex: '#6A0DAD', rgb: [106, 13, 173] },
  { code: 'B131', name: 'Dark Purple',       hex: '#4B0082', rgb: [75, 0, 130] },
  { code: 'B132', name: 'Deep Violet',       hex: '#492557', rgb: [73, 37, 87] },
  { code: 'B133', name: 'Indigo',            hex: '#512E80', rgb: [81, 46, 128] },
  { code: 'B134', name: 'Magenta Purple',    hex: '#8B008B', rgb: [139, 0, 139] },

  // ===== 棕 / 木色系 (14色) =====
  { code: 'B135', name: 'Beige',             hex: '#F5F5DC', rgb: [245, 245, 220] },
  { code: 'B136', name: 'Sand',              hex: '#EDD9B4', rgb: [237, 217, 180] },
  { code: 'B137', name: 'Fawn',              hex: '#E8C396', rgb: [232, 195, 150] },
  { code: 'B138', name: 'Tan',               hex: '#D2B48C', rgb: [210, 180, 140] },
  { code: 'B139', name: 'Light Brown',       hex: '#C49A6C', rgb: [196, 154, 108] },
  { code: 'B140', name: 'Cocoa',             hex: '#927A64', rgb: [146, 122, 100] },
  { code: 'B141', name: 'Chestnut',          hex: '#8B6B4E', rgb: [139, 107, 78] },
  { code: 'B142', name: 'Brown',             hex: '#8B5E3C', rgb: [139, 94, 60] },
  { code: 'B143', name: 'Walnut',            hex: '#6B3A2B', rgb: [107, 58, 43] },
  { code: 'B144', name: 'Dark Brown',        hex: '#5C3A1E', rgb: [92, 58, 30] },
  { code: 'B145', name: 'Mahogany',          hex: '#60281C', rgb: [96, 40, 28] },
  { code: 'B146', name: 'Espresso',          hex: '#3E2723', rgb: [62, 39, 35] },
  { code: 'B147', name: 'Taupe',             hex: '#A1887F', rgb: [161, 136, 127] },
  { code: 'B148', name: 'Warm Grey',         hex: '#D7CCC8', rgb: [215, 204, 200] },

  // ===== 肤色系 (10色) =====
  { code: 'B149', name: 'Skin Ivory',        hex: '#FFE6D0', rgb: [255, 230, 208] },
  { code: 'B150', name: 'Skin Fair',         hex: '#FFDFC4', rgb: [255, 223, 196] },
  { code: 'B151', name: 'Skin Porcelain',    hex: '#FFE0CC', rgb: [255, 224, 204] },
  { code: 'B152', name: 'Skin Light',        hex: '#F5CBA7', rgb: [245, 203, 167] },
  { code: 'B153', name: 'Skin Warm',         hex: '#F0C4A0', rgb: [240, 196, 160] },
  { code: 'B154', name: 'Skin Medium',       hex: '#D2A679', rgb: [210, 166, 121] },
  { code: 'B155', name: 'Skin Olive',        hex: '#D4A372', rgb: [212, 163, 114] },
  { code: 'B156', name: 'Skin Tan',          hex: '#B8865E', rgb: [184, 134, 94] },
  { code: 'B157', name: 'Skin Bronze',       hex: '#B6825A', rgb: [182, 130, 90] },
  { code: 'B158', name: 'Skin Dark',         hex: '#8D5524', rgb: [141, 85, 36] },

  // ===== 金属 / 特殊色 (10色) =====
  { code: 'B159', name: 'Metallic Gold',     hex: '#D4AF37', rgb: [212, 175, 55] },
  { code: 'B160', name: 'Metallic Silver',   hex: '#C0C6CC', rgb: [192, 198, 204] },
  { code: 'B161', name: 'Metallic Pewter',   hex: '#BCC6CC', rgb: [188, 198, 204] },
  { code: 'B162', name: 'Copper',            hex: '#B87333', rgb: [184, 115, 51] },
  { code: 'B163', name: 'Bronze',            hex: '#CD7F32', rgb: [205, 127, 50] },
  { code: 'B164', name: 'Rose Gold',         hex: '#E5A899', rgb: [229, 168, 153] },
  { code: 'B165', name: 'Silver',            hex: '#BDBDBD', rgb: [189, 189, 189] },
  { code: 'B166', name: 'Champagne',         hex: '#F7E7CE', rgb: [247, 231, 206] },
  { code: 'B167', name: 'Bright Gold',       hex: '#FFC107', rgb: [255, 193, 7] },
  { code: 'B168', name: 'Brass',             hex: '#C59B3B', rgb: [197, 155, 59] },

  // ===== 扩展补充色 (96色，填充至264) =====
  // 补充灰阶 (8色)
  { code: 'B169', name: 'Storm Grey',        hex: '#6B6B6B', rgb: [107, 107, 107] },
  { code: 'B170', name: 'Ash Grey',          hex: '#9B9B9B', rgb: [155, 155, 155] },
  { code: 'B171', name: 'Smoke',             hex: '#BEBEBE', rgb: [190, 190, 190] },
  { code: 'B172', name: 'Fog',               hex: '#C8C8C8', rgb: [200, 200, 200] },
  { code: 'B173', name: 'Dove Grey',         hex: '#E0E0E0', rgb: [224, 224, 224] },
  { code: 'B174', name: 'Pearl',             hex: '#F0F0F0', rgb: [240, 240, 240] },
  { code: 'B175', name: 'Graphite',          hex: '#4A4A4A', rgb: [74, 74, 74] },
  { code: 'B176', name: 'Gunmetal',          hex: '#2C2C2C', rgb: [44, 44, 44] },

  // 补充粉系 (8色)
  { code: 'B177', name: 'Candy Pink',        hex: '#FF9BB5', rgb: [255, 155, 181] },
  { code: 'B178', name: 'Carnation',         hex: '#FFAACC', rgb: [255, 170, 204] },
  { code: 'B179', name: 'Peony',             hex: '#E8809A', rgb: [232, 128, 154] },
  { code: 'B180', name: 'Ruby Pink',         hex: '#D04075', rgb: [208, 64, 117] },
  { code: 'B181', name: 'Watermelon',        hex: '#FC6C85', rgb: [252, 108, 133] },
  { code: 'B182', name: 'Barbie Pink',       hex: '#E0218A', rgb: [224, 33, 138] },
  { code: 'B183', name: 'Azalea',            hex: '#F078A0', rgb: [240, 120, 160] },
  { code: 'B184', name: 'Cotton Candy',      hex: '#FFBCD8', rgb: [255, 188, 216] },

  // 补充红系 (8色)
  { code: 'B185', name: 'Scarlet',           hex: '#FF2400', rgb: [255, 36, 0] },
  { code: 'B186', name: 'Vermilion',         hex: '#E34234', rgb: [227, 66, 52] },
  { code: 'B187', name: 'Amaranth',          hex: '#D3212D', rgb: [211, 33, 45] },
  { code: 'B188', name: 'Ruby',              hex: '#9B111E', rgb: [155, 17, 30] },
  { code: 'B189', name: 'Carmine',           hex: '#960018', rgb: [150, 0, 24] },
  { code: 'B190', name: 'Maroon',            hex: '#800000', rgb: [128, 0, 0] },
  { code: 'B191', name: 'Redwood',           hex: '#A0522D', rgb: [160, 82, 45] },
  { code: 'B192', name: 'Strawberry',        hex: '#FF3B3B', rgb: [255, 59, 59] },

  // 补充橙系 (8色)
  { code: 'B193', name: 'Cantaloupe',        hex: '#FFA06B', rgb: [255, 160, 107] },
  { code: 'B194', name: 'Persimmon',         hex: '#EC5800', rgb: [236, 88, 0] },
  { code: 'B195', name: 'Papaya',            hex: '#FFB88C', rgb: [255, 184, 140] },
  { code: 'B196', name: 'Mango',             hex: '#FF9F33', rgb: [255, 159, 51] },
  { code: 'B197', name: 'Sunset Orange',     hex: '#FF6030', rgb: [255, 96, 48] },
  { code: 'B198', name: 'Amber Orange',      hex: '#FFB300', rgb: [255, 179, 0] },
  { code: 'B199', name: 'Cinnamon',          hex: '#D2691E', rgb: [210, 105, 30] },
  { code: 'B200', name: 'Terracotta',        hex: '#E2725B', rgb: [226, 114, 91] },

  // 补充黄系 (8色)
  { code: 'B201', name: 'Daffodil',          hex: '#FFF700', rgb: [255, 247, 0] },
  { code: 'B202', name: 'Honey',             hex: '#EBBC30', rgb: [235, 188, 48] },
  { code: 'B203', name: 'Saffron',           hex: '#F4C430', rgb: [244, 196, 48] },
  { code: 'B204', name: 'Sunflower',         hex: '#FFDA03', rgb: [255, 218, 3] },
  { code: 'B205', name: 'Maize',             hex: '#FBEC5D', rgb: [251, 236, 93] },
  { code: 'B206', name: 'Marigold',          hex: '#EAA221', rgb: [234, 162, 33] },
  { code: 'B207', name: 'Citron',            hex: '#DDD618', rgb: [221, 214, 24] },
  { code: 'B208', name: 'Pollen',            hex: '#FFE066', rgb: [255, 224, 102] },

  // 补充绿系 (8色)
  { code: 'B209', name: 'Grass Green',       hex: '#7CFC00', rgb: [124, 252, 0] },
  { code: 'B210', name: 'Shamrock',          hex: '#00A86B', rgb: [0, 168, 107] },
  { code: 'B211', name: 'Jade',              hex: '#00A36C', rgb: [0, 163, 108] },
  { code: 'B212', name: 'Moss',              hex: '#8A9A5B', rgb: [138, 154, 91] },
  { code: 'B213', name: 'Fern',              hex: '#5D8C41', rgb: [93, 140, 65] },
  { code: 'B214', name: 'Cucumber',          hex: '#7BA23F', rgb: [123, 162, 63] },
  { code: 'B215', name: 'Avocado',           hex: '#688038', rgb: [104, 128, 56] },
  { code: 'B216', name: 'Pistachio',         hex: '#93C572', rgb: [147, 197, 114] },

  // 补充青系 (8色)
  { code: 'B217', name: 'Tiffany Blue',      hex: '#0ABAB5', rgb: [10, 186, 181] },
  { code: 'B218', name: 'Peacock',           hex: '#009DA5', rgb: [0, 157, 165] },
  { code: 'B219', name: 'Lagoon',            hex: '#00B4A6', rgb: [0, 180, 166] },
  { code: 'B220', name: 'Cerulean Cyan',     hex: '#008B8B', rgb: [0, 139, 139] },
  { code: 'B221', name: 'Ice Cyan',          hex: '#AEEEEE', rgb: [174, 238, 238] },
  { code: 'B222', name: 'Pool',              hex: '#89CFF0', rgb: [137, 207, 240] },
  { code: 'B223', name: 'Glacier',           hex: '#78C9C0', rgb: [120, 201, 192] },
  { code: 'B224', name: 'Malachite',         hex: '#00A693', rgb: [0, 166, 147] },

  // 补充蓝系 (8色)
  { code: 'B225', name: 'Azure',             hex: '#007FFF', rgb: [0, 127, 255] },
  { code: 'B226', name: 'Sapphire',          hex: '#0F52BA', rgb: [15, 82, 186] },
  { code: 'B227', name: 'Cobalt',            hex: '#0047AB', rgb: [0, 71, 171] },
  { code: 'B228', name: 'Ultramarine',       hex: '#120A8F', rgb: [18, 10, 143] },
  { code: 'B229', name: 'Powder Blue',       hex: '#B0E0E6', rgb: [176, 224, 230] },
  { code: 'B230', name: 'Alice Blue',        hex: '#E6F2FF', rgb: [230, 242, 255] },
  { code: 'B231', name: 'Iceberg',           hex: '#71A6D2', rgb: [113, 166, 210] },
  { code: 'B232', name: 'Twilight Blue',     hex: '#4B6EAA', rgb: [75, 110, 170] },

  // 补充紫系 (8色)
  { code: 'B233', name: 'Amethyst',          hex: '#9966CC', rgb: [153, 102, 204] },
  { code: 'B234', name: 'Heliotrope',        hex: '#DF73FF', rgb: [223, 115, 255] },
  { code: 'B235', name: 'Wisteria',          hex: '#C9A0DC', rgb: [201, 160, 220] },
  { code: 'B236', name: 'Byzantium',         hex: '#702963', rgb: [112, 41, 99] },
  { code: 'B237', name: 'Eggplant',          hex: '#614051', rgb: [97, 64, 81] },
  { code: 'B238', name: 'Boysenberry',       hex: '#873260', rgb: [135, 50, 96] },
  { code: 'B239', name: 'Royal Purple',      hex: '#7851A9', rgb: [120, 81, 169] },
  { code: 'B240', name: 'Heather',           hex: '#A88CB0', rgb: [168, 140, 176] },

  // 补充棕系 (8色)
  { code: 'B241', name: 'Caramel',           hex: '#C68E58', rgb: [198, 142, 88] },
  { code: 'B242', name: 'Hazel',             hex: '#A36E4B', rgb: [163, 110, 75] },
  { code: 'B243', name: 'Sandstone',         hex: '#D5B89B', rgb: [213, 184, 155] },
  { code: 'B244', name: 'Mocha',             hex: '#967969', rgb: [150, 121, 105] },
  { code: 'B245', name: 'Sepia',             hex: '#704214', rgb: [112, 66, 20] },
  { code: 'B246', name: 'Umber',             hex: '#635147', rgb: [99, 81, 71] },
  { code: 'B247', name: 'Pecan',             hex: '#A17A49', rgb: [161, 122, 73] },
  { code: 'B248', name: 'Oatmeal',           hex: '#D4C4A8', rgb: [212, 196, 168] },

  // 补充肤色 (8色)
  { code: 'B249', name: 'Skin Alabaster',    hex: '#FCE4D6', rgb: [252, 228, 214] },
  { code: 'B250', name: 'Skin Bisque',       hex: '#FFE4C4', rgb: [255, 228, 196] },
  { code: 'B251', name: 'Skin Honey',        hex: '#E8C89E', rgb: [232, 200, 158] },
  { code: 'B252', name: 'Skin Almond',       hex: '#C8A87C', rgb: [200, 168, 124] },
  { code: 'B253', name: 'Skin Caramel',      hex: '#A67B5B', rgb: [166, 123, 91] },
  { code: 'B254', name: 'Skin Mocha',        hex: '#9B6C4A', rgb: [155, 108, 74] },
  { code: 'B255', name: 'Skin Cocoa',        hex: '#7B4E32', rgb: [123, 78, 50] },
  { code: 'B256', name: 'Skin Espresso',     hex: '#5C3317', rgb: [92, 51, 23] },

  // 补充特殊色 (8色)
  { code: 'B257', name: 'Neon Coral',        hex: '#FF6B6B', rgb: [255, 107, 107] },
  { code: 'B258', name: 'Neon Magenta',      hex: '#FF00FF', rgb: [255, 0, 255] },
  { code: 'B259', name: 'Neon Cyan',         hex: '#00FFFF', rgb: [0, 255, 255] },
  { code: 'B260', name: 'Neon Lime',         hex: '#CCFF00', rgb: [204, 255, 0] },
  { code: 'B261', name: 'Glow White',        hex: '#FFFEFA', rgb: [255, 254, 250] },
  { code: 'B262', name: 'Clear',             hex: '#E8E8E8', rgb: [232, 232, 232] },
  { code: 'B263', name: 'Glitter Gold',      hex: '#E6BE8A', rgb: [230, 190, 138] },
  { code: 'B264', name: 'Oil Slick',         hex: '#1A1A2E', rgb: [26, 26, 46] },
]

// 直接导出色盘数组
export { paletteColors }

/**
 * 获取全部色盘颜色
 */
export function getPaletteColors(): PaletteColor[] {
  return paletteColors
}